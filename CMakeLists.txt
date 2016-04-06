cmake_minimum_required(VERSION 2.8.12.2)

set(PROJECT_NAME smallHtmlParser)

project(${PROJECT_NAME})

set( SOURCES
    main.cpp
    sources/dom_tree.h
    sources/dom_tree.cpp
    sources/dom_node.h
    sources/dom_node.cpp
    sources/dom_attribute.h
    sources/dom_attribute.cpp
    sources/dom_parser.h
    sources/dom_parser.cpp
    sources/dom_tag_content.h
    sources/dom_tag_content.cpp
    )

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread -g")

find_package( Boost 1.34 COMPONENTS regex )
link_directories ( ${Boost_LIBRARY_DIRS} )
include_directories ( ${Boost_INCLUDE_DIRS} )


add_executable(${PROJECT_NAME} ${SOURCES})
target_link_libraries (
    ${PROJECT_NAME}
    ${Boost_LIBRARIES}
    )