cmake_minimum_required(VERSION 3.22.1)

project("tamercad_kernel")

add_library(
        tamercad_kernel
        SHARED
        tamercad_kernel.cpp)

find_library(
        log-lib
        log)

target_link_libraries(
        tamercad_kernel
        ${log-lib})
