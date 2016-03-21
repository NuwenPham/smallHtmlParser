cmake_minimum_required(VERSION 2.8.12.2)

set(PROJECT_NAME smallHtmlParser)

project(${PROJECT_NAME})

set( SOURCES
    main.cpp
    )

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")

add_executable(${PROJECT_NAME} ${SOURCES})