{
  "targets": [
    {
      "target_name": "KyaniteSDK",
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "<(module_root_dir)/include"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "NAPI_VERSION=8"
      ],
      "sources": [
        "<(module_root_dir)/src/ui.cpp",
        "<(module_root_dir)/include/imgui/imgui_demo.cpp",
        "<(module_root_dir)/include/imgui/imgui_draw.cpp",
        "<(module_root_dir)/include/imgui/imgui_impl_dx9.cpp",
        "<(module_root_dir)/include/imgui/imgui_impl_win32.cpp",
        "<(module_root_dir)/include/imgui/imgui_tables.cpp",
        "<(module_root_dir)/include/imgui/imgui_widgets.cpp",
        "<(module_root_dir)/include/imgui/imgui.cpp"
      ]
    }
  ]
}
