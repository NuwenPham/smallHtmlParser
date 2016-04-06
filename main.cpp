#include <stdio.h>
#include <iostream>
#include <string>

#include "sources/dom_tree.h"
#include "sources/dom_node.h"
#include "sources/dom_parser.h"
#include <boost/regex.hpp>

int main(int argc, char *argv[])
{
   if( argc < 3){
      std::cout << "must be two options." << std::endl;
   }
   std::cout << argv[1] << std::endl;
   std::cout << argv[2] << std::endl;

   std::string str(argv[1]);
   boost::regex rx(std::string(argv[2]));
   boost::smatch results;
   boost::regex_match(str, results, rx);



   return 0;
}