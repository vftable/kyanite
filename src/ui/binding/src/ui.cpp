#include <iostream>
#include <variant>

#include <windows.h>
#include <dwmapi.h>
#include <d3d9.h>

#include "imgui/imgui.h"
#include "imgui/imgui_impl_dx9.h"
#include "imgui/imgui_impl_win32.h"

#ifndef NAPI_VERSION
#define NAPI_VERSION 8;
#endif

#include <napi.h>

using namespace Napi;

#pragma comment(lib,"d3d9.lib")

bool isInitialised = false;
bool menuShow = true;
HWND _HWND = NULL;
int ScreenHeight = NULL;
int ScreenWidth = NULL;
int ScreenLeft = NULL;
int ScreenRight = NULL;
int ScreenTop = NULL;
int ScreenBottom = NULL;

DWORD m_dRainbowHex;
float m_fRainbowRGB[3];

ImGuiContext* ctx;

namespace OverlayWindow
{
	WNDCLASSEXW WindowClass;
	HWND Hwnd;
	LPCWSTR Name;
}

namespace DirectX9Interface
{
	IDirect3D9Ex* Direct3D9 = NULL;
	IDirect3DDevice9Ex* pDevice = NULL;
	D3DPRESENT_PARAMETERS pParams = { NULL };
	MARGINS Margin = { -1 };
	MSG Message = { NULL };
}

void InputHandler() {
	for (int i = 0; i < 5; i++) ImGui::GetIO().MouseDown[i] = false;
	int button = -1;
	if (GetAsyncKeyState(VK_LBUTTON)) button = 0;
	if (button != -1) ImGui::GetIO().MouseDown[button] = true;
}

bool toggleState[128] = {  };
bool oldToggleState[128] = {  };

float sliderState[128] = {  };
float oldSliderState[128] = {  };

struct RenderElement {
  std::string label;
  std::string type;
  std::variant<FunctionReference, std::nullptr_t> callback;
};

RenderElement renderElements[128] = {  };

int renderElementCount = 0;

void UpdateRainbow(float *primaryRGB, float length, float hue) {
		//Blume's rainbow rewrite

		float primaryHSB[3];
		ImGui::ColorConvertRGBtoHSV(primaryRGB[0], primaryRGB[1], primaryRGB[2], primaryHSB[0], primaryHSB[1], primaryHSB[2]);

		float lengthMs = length * 1000.0f;
		float timedHue = GetTickCount() % (long int)(lengthMs) / lengthMs;

		//"hue" for "indexedHue"
		float hue2 = timedHue + hue * 0.05f + 1.f;
		ImGui::ColorConvertHSVtoRGB(hue2, primaryHSB[1], primaryHSB[2], m_fRainbowRGB[0], m_fRainbowRGB[1], m_fRainbowRGB[2]);
		m_dRainbowHex = D3DCOLOR_RGBA((int)m_fRainbowRGB[0], (int)m_fRainbowRGB[1], (int)m_fRainbowRGB[2], 255);
}

void Render(Env env)
{
	if (GetAsyncKeyState(VK_TAB) & 1)
		menuShow = !menuShow;

	ImGui_ImplDX9_NewFrame();
	ImGui_ImplWin32_NewFrame();

	ImGui::NewFrame();
	ImGui::GetIO().MouseDrawCursor = menuShow;

	const char* exampleMods[5] = { "Rainbow Icon", "FPS Bypass", "NoClip", "Icon Unlock", "Cocos Explorer" };

	if (menuShow)
	{
		InputHandler();
		ImGui::SetNextWindowSize(ImVec2(300, 300));
		ImGui::Begin("Kyanite", 0);

		AllocConsole();
		freopen("CONOUT$", "w", stdout);

		for (int i = 0; i < renderElementCount; i++) {
			ImGui::SetCurrentContext(ctx);

			if (renderElements[i].type == "checkbox") {
				ImGui::SetCurrentContext(ctx);

				ImGui::Checkbox(renderElements[i].label.c_str(), &toggleState[i]);

				if (toggleState[i] != oldToggleState[i]) {
					std::get<FunctionReference>(renderElements[i].callback).Call({ Boolean::New(env, toggleState[i]) });
				}

				oldToggleState[i] = toggleState[i];
			} else if (renderElements[i].type == "label") {
				ImGui::SetCurrentContext(ctx);

				ImGui::Text(renderElements[i].label.c_str());
			} else if (renderElements[i].type == "slider") {
				ImGui::SetCurrentContext(ctx);

				ImGui::SliderFloat(renderElements[i].label.c_str(), &sliderState[i], 0.0f, 1.0f, "ratio = %.3f");

				if (sliderState[i] != oldSliderState[i]) {
					std::get<FunctionReference>(renderElements[i].callback).Call({ Number::New(env, sliderState[i]) });
				}

				oldSliderState[i] = sliderState[i];
			}
		}

		ImGui::End();
	}

	ImGui::EndFrame();

	DirectX9Interface::pDevice->SetRenderState(D3DRS_ZENABLE, false);
	DirectX9Interface::pDevice->SetRenderState(D3DRS_ALPHABLENDENABLE, false);
	DirectX9Interface::pDevice->SetRenderState(D3DRS_SCISSORTESTENABLE, false);

	DirectX9Interface::pDevice->Clear(0, NULL, D3DCLEAR_TARGET, D3DCOLOR_ARGB(0, 0, 0, 0), 1.0f, 0);
	if (DirectX9Interface::pDevice->BeginScene() >= 0) {
		ImGui::Render();
		ImGui_ImplDX9_RenderDrawData(ImGui::GetDrawData());
		DirectX9Interface::pDevice->EndScene();
	}

	HRESULT result = DirectX9Interface::pDevice->Present(NULL, NULL, NULL, NULL);
	if (result == D3DERR_DEVICELOST && DirectX9Interface::pDevice->TestCooperativeLevel() == D3DERR_DEVICENOTRESET) {
		ImGui_ImplDX9_InvalidateDeviceObjects();
		DirectX9Interface::pDevice->Reset(&DirectX9Interface::pParams);
		ImGui_ImplDX9_CreateDeviceObjects();
	}
}

void DoRender(const CallbackInfo &info) {
	static RECT OldRect;
	
	if (PeekMessage(&DirectX9Interface::Message, OverlayWindow::Hwnd, 0, 0, PM_REMOVE)) {
		TranslateMessage(&DirectX9Interface::Message);
		DispatchMessage(&DirectX9Interface::Message);
	}
	HWND ForegroundWindow = GetForegroundWindow();
	if (ForegroundWindow == _HWND) {
		HWND TempProcessHwnd = GetWindow(ForegroundWindow, GW_HWNDPREV);
		SetWindowPos(OverlayWindow::Hwnd, TempProcessHwnd, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
	}

	RECT TempRect;
	POINT TempPoint;
	ZeroMemory(&TempRect, sizeof(RECT));
	ZeroMemory(&TempPoint, sizeof(POINT));

	GetClientRect(_HWND, &TempRect);
	ClientToScreen(_HWND, &TempPoint);

	TempRect.left = TempPoint.x;
	TempRect.top = TempPoint.y;
	ImGuiIO& io = ImGui::GetIO();
	io.ImeWindowHandle = _HWND;

	POINT TempPoint2;
	GetCursorPos(&TempPoint2);
	io.MousePos.x = TempPoint2.x - TempPoint.x;
	io.MousePos.y = TempPoint2.y - TempPoint.y;

	if (GetAsyncKeyState(0x1)) {
		io.MouseDown[0] = true;
		io.MouseClicked[0] = true;
		io.MouseClickedPos[0].x = io.MousePos.x;
		io.MouseClickedPos[0].x = io.MousePos.y;
	}
	else {
		io.MouseDown[0] = false;
	}

	if (TempRect.left != OldRect.left || TempRect.right != OldRect.right || TempRect.top != OldRect.top || TempRect.bottom != OldRect.bottom) {
		OldRect = TempRect;
		ScreenWidth = TempRect.right;
		ScreenHeight = TempRect.bottom;
		DirectX9Interface::pParams.BackBufferWidth = ScreenWidth;
		DirectX9Interface::pParams.BackBufferHeight = ScreenHeight;
		SetWindowPos(OverlayWindow::Hwnd, (HWND)0, TempPoint.x, TempPoint.y, ScreenWidth, ScreenHeight, SWP_NOREDRAW);
		DirectX9Interface::pDevice->Reset(&DirectX9Interface::pParams);
	}

	auto &colors = ImGui::GetStyle().Colors;

	colors[ImGuiCol_WindowBg] = ImVec4{0.1f, 0.1f, 0.13f, 1.0f};
	colors[ImGuiCol_MenuBarBg] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};

	// Border
	colors[ImGuiCol_Border] = ImVec4{0.44f, 0.37f, 0.61f, 0.29f};
	colors[ImGuiCol_BorderShadow] = ImVec4{0.0f, 0.0f, 0.0f, 0.24f};

	// Text
	colors[ImGuiCol_Text] = ImVec4{1.0f, 1.0f, 1.0f, 1.0f};
	colors[ImGuiCol_TextDisabled] = ImVec4{0.5f, 0.5f, 0.5f, 1.0f};

	// Headers
	colors[ImGuiCol_Header] = ImVec4{0.13f, 0.13f, 0.17, 1.0f};
	colors[ImGuiCol_HeaderHovered] = ImVec4{0.19f, 0.2f, 0.25f, 1.0f};
	colors[ImGuiCol_HeaderActive] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};

	// Buttons
	colors[ImGuiCol_Button] = ImVec4{0.13f, 0.13f, 0.17, 1.0f};
	colors[ImGuiCol_ButtonHovered] = ImVec4{0.19f, 0.2f, 0.25f, 1.0f};
	colors[ImGuiCol_ButtonActive] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_CheckMark] = ImVec4{0.74f, 0.58f, 0.98f, 1.0f};

	// Popups
	colors[ImGuiCol_PopupBg] = ImVec4{0.1f, 0.1f, 0.13f, 0.92f};

	// Slider
	colors[ImGuiCol_SliderGrab] = ImVec4{0.44f, 0.37f, 0.61f, 0.54f};
	colors[ImGuiCol_SliderGrabActive] = ImVec4{0.74f, 0.58f, 0.98f, 0.54f};

	// Frame BG
	colors[ImGuiCol_FrameBg] = ImVec4{0.13f, 0.13, 0.17, 1.0f};
	colors[ImGuiCol_FrameBgHovered] = ImVec4{0.19f, 0.2f, 0.25f, 1.0f};
	colors[ImGuiCol_FrameBgActive] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};

	// Tabs
	colors[ImGuiCol_Tab] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_TabHovered] = ImVec4{0.24, 0.24f, 0.32f, 1.0f};
	colors[ImGuiCol_TabActive] = ImVec4{0.2f, 0.22f, 0.27f, 1.0f};
	colors[ImGuiCol_TabUnfocused] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_TabUnfocusedActive] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};

	// Title
	colors[ImGuiCol_TitleBg] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_TitleBgActive] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_TitleBgCollapsed] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};

	// Scrollbar
	colors[ImGuiCol_ScrollbarBg] = ImVec4{0.1f, 0.1f, 0.13f, 1.0f};
	colors[ImGuiCol_ScrollbarGrab] = ImVec4{0.16f, 0.16f, 0.21f, 1.0f};
	colors[ImGuiCol_ScrollbarGrabHovered] = ImVec4{0.19f, 0.2f, 0.25f, 1.0f};
	colors[ImGuiCol_ScrollbarGrabActive] = ImVec4{0.24f, 0.24f, 0.32f, 1.0f};

	// Seperator
	colors[ImGuiCol_Separator] = ImVec4{0.44f, 0.37f, 0.61f, 1.0f};
	colors[ImGuiCol_SeparatorHovered] = ImVec4{0.74f, 0.58f, 0.98f, 1.0f};
	colors[ImGuiCol_SeparatorActive] = ImVec4{0.84f, 0.58f, 1.0f, 1.0f};

	// Resize Grip
	colors[ImGuiCol_ResizeGrip] = ImVec4{0.44f, 0.37f, 0.61f, 0.29f};
	colors[ImGuiCol_ResizeGripHovered] = ImVec4{0.74f, 0.58f, 0.98f, 0.29f};
	colors[ImGuiCol_ResizeGripActive] = ImVec4{0.84f, 0.58f, 1.0f, 0.29f};

	auto &style = ImGui::GetStyle();
	style.TabRounding = 2;
	style.ScrollbarRounding = 8;
	style.WindowRounding = 6;
	style.GrabRounding = 2;
	style.FrameRounding = 2;
	style.PopupRounding = 4;
	style.ChildRounding = 4;

	Render(info.Env());
}

bool DirectXInit() {
	if (FAILED(Direct3DCreate9Ex(D3D_SDK_VERSION, &DirectX9Interface::Direct3D9))) {
		return false;
	}

	D3DPRESENT_PARAMETERS Params = { 0 };
	Params.Windowed = TRUE;
	Params.SwapEffect = D3DSWAPEFFECT_DISCARD;
	Params.hDeviceWindow = OverlayWindow::Hwnd;
	Params.MultiSampleQuality = D3DMULTISAMPLE_NONE;
	Params.BackBufferFormat = D3DFMT_A8R8G8B8;
	Params.BackBufferWidth = ScreenWidth;
	Params.BackBufferHeight =ScreenHeight;
	Params.PresentationInterval = D3DPRESENT_INTERVAL_ONE;
	Params.EnableAutoDepthStencil = TRUE;
	Params.AutoDepthStencilFormat = D3DFMT_D16;
	Params.PresentationInterval = D3DPRESENT_INTERVAL_ONE;
	Params.FullScreen_RefreshRateInHz = D3DPRESENT_RATE_DEFAULT;

	if (FAILED(DirectX9Interface::Direct3D9->CreateDeviceEx(D3DADAPTER_DEFAULT, D3DDEVTYPE_HAL, OverlayWindow::Hwnd, D3DCREATE_HARDWARE_VERTEXPROCESSING, &Params, 0, &DirectX9Interface::pDevice))) {
		DirectX9Interface::Direct3D9->Release();
		return false;
	}

	ctx = ImGui::CreateContext();

	ImGuiIO& io = ImGui::GetIO();
	ImGui::GetIO().WantCaptureMouse || ImGui::GetIO().WantTextInput || ImGui::GetIO().WantCaptureKeyboard;
	io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;

	ImGui_ImplWin32_Init(OverlayWindow::Hwnd);
	ImGui_ImplDX9_Init(DirectX9Interface::pDevice);
	DirectX9Interface::Direct3D9->Release();
	return true;
}

extern IMGUI_IMPL_API LRESULT ImGui_ImplWin32_WndProcHandler(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam);
LRESULT CALLBACK WinProc(HWND hWnd, UINT Message, WPARAM wParam, LPARAM lParam) {
	if (ImGui_ImplWin32_WndProcHandler(hWnd, Message, wParam, lParam))
		return true;

	switch (Message) {
	case WM_DESTROY:
		if (DirectX9Interface::pDevice != NULL) {
			DirectX9Interface::pDevice->EndScene();
			DirectX9Interface::pDevice->Release();
		}
		if (DirectX9Interface::Direct3D9 != NULL) {
			DirectX9Interface::Direct3D9->Release();
		}
		PostQuitMessage(0);
		exit(4);
		break;
	case WM_SIZE:
		if (DirectX9Interface::pDevice != NULL && wParam != SIZE_MINIMIZED) {
			ImGui_ImplDX9_InvalidateDeviceObjects();
			DirectX9Interface::pParams.BackBufferWidth = LOWORD(lParam);
			DirectX9Interface::pParams.BackBufferHeight = HIWORD(lParam);
			HRESULT hr = DirectX9Interface::pDevice->Reset(&DirectX9Interface::pParams);
			if (hr == D3DERR_INVALIDCALL)
				IM_ASSERT(0);
			ImGui_ImplDX9_CreateDeviceObjects();
		}
		break;
	default:
		return DefWindowProc(hWnd, Message, wParam, lParam);
		break;
	}
	return 0;
}

void SetupWindow() {
	WNDCLASSEXW wndClass = {
		sizeof(WNDCLASSEXW), 0, WinProc, 0, 0, nullptr, LoadIcon(nullptr, IDI_APPLICATION), LoadCursor(nullptr, IDC_ARROW), nullptr, nullptr, OverlayWindow::Name, LoadIcon(nullptr, IDI_APPLICATION)
	};

	RegisterClassExW(&wndClass);
	if (_HWND) {
		static RECT TempRect = { NULL };
		static POINT TempPoint;
		GetClientRect(_HWND, &TempRect);
		ClientToScreen(_HWND, &TempPoint);
		TempRect.left = TempPoint.x;
		TempRect.top = TempPoint.y;
		ScreenWidth = TempRect.right;
		ScreenHeight = TempRect.bottom;
	}

	OverlayWindow::Hwnd = CreateWindowExW(NULL, OverlayWindow::Name, OverlayWindow::Name, WS_POPUP | WS_VISIBLE, ScreenLeft, ScreenTop, ScreenWidth, ScreenHeight, NULL, NULL, 0, NULL);
	DwmExtendFrameIntoClientArea(OverlayWindow::Hwnd, &DirectX9Interface::Margin);
	SetWindowLong(OverlayWindow::Hwnd, GWL_EXSTYLE, WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW);
	ShowWindow(OverlayWindow::Hwnd, SW_SHOW);
	UpdateWindow(OverlayWindow::Hwnd);
}

Boolean IsInitialised(const CallbackInfo &info)
{
	return Boolean::New(info.Env(), isInitialised);
}

void SetupOverlay(const CallbackInfo &info)
{
	std::string target = info[0].As<String>();

	_HWND = FindWindowA(NULL, target.c_str());

	bool WindowFocus = false;
	while (WindowFocus == false)
	{

		HWND hwnd_active = GetForegroundWindow();

		if (_HWND == hwnd_active) {
			_HWND = GetForegroundWindow();

			RECT TempRect;
			GetWindowRect(_HWND, &TempRect);
			ScreenWidth = TempRect.right - TempRect.left;
			ScreenHeight = TempRect.bottom - TempRect.top;
			ScreenLeft = TempRect.left;
			ScreenRight = TempRect.right;
			ScreenTop = TempRect.top;
			ScreenBottom = TempRect.bottom;

			WindowFocus = true;
		}
	}

	OverlayWindow::Name = L"Kyanite";

	SetupWindow();
	DirectXInit();

	isInitialised = true;
}

void CreateLabel(const CallbackInfo& info) {
	renderElements[renderElementCount] = {
		info[0].As<String>().Utf8Value(),
		"label",
		nullptr
	};

	renderElementCount++;
}

void CreateCheckbox(const CallbackInfo& info) {
	renderElements[renderElementCount] = {
		info[0].As<String>().Utf8Value(),
		"checkbox",
		Persistent(info[1].As<Function>())
	};

	renderElementCount++;
}

void CreateSlider(const CallbackInfo& info) {
	renderElements[renderElementCount] = {
		info[0].As<String>().Utf8Value(),
		"slider",
		Persistent(info[1].As<Function>())
	};

	renderElementCount++;
}

Object Init(Env env, Object exports)
{
	Object components = Object::New(env);
	components.Set("createLabel", Function::New(env, CreateLabel));
	components.Set("createCheckbox", Function::New(env, CreateCheckbox));
	components.Set("createSlider", Function::New(env, CreateSlider));

	exports.Set("Components", components);

	exports.Set("doRender", Function::New(env, DoRender));
	exports.Set("isInitialised", Function::New(env, IsInitialised));
	exports.Set("setupOverlay", Function::New(env, SetupOverlay));

	return exports;
}

NODE_API_MODULE(addon, Init)