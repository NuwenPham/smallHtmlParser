#include <stdio.h>
#include <iostream>
#include <string>

#include "sources/dom_tree.h"
#include "sources/dom_node.h"
#include "sources/dom_parser.h"
#include <boost/regex.hpp>
#include <boost/xpressive/xpressive.hpp>

using namespace boost::xpressive;

int main(int argc, char *argv[])
{
//   if( argc < 3){
//      std::cout << "must be two options." << std::endl;
//   }
//   std::cout << argv[1] << std::endl;
//   std::cout << argv[2] << std::endl;
//
//   std::string str(argv[1]);
//   boost::regex rx(std::string(argv[2]));
//   boost::cmatch results;
//   boost::regex_match(str, results, rx);


std::string hello( "hello world!" );

    sregex rex = sregex::compile( "(\\w+) (\\w+)!" );
    smatch what;

    if( regex_match( hello, what, rex ) )
    {
        std::cout << what[0] << '\n'; // whole match
        std::cout << what[1] << '\n'; // first capture
        std::cout << what[2] << '\n'; // second capture
    }

   return 0;
}