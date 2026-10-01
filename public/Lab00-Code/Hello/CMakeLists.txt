# One program: every .cpp file in this folder, built together.
# For your own program: copy this file into its folder and change Hello below.
cmake_minimum_required(VERSION 3.20)
project(Hello LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)

file(GLOB SOURCES CONFIGURE_DEPENDS *.cpp)
add_executable(${PROJECT_NAME} ${SOURCES})

if(MSVC)
  target_compile_options(${PROJECT_NAME} PRIVATE /W4 /permissive-)
else()
  target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
endif()
