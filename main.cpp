#include <stdio.h>
#include <iostream>

#include "sources/dom_tree.h"

int main(int argc, char **argv)
{
   int a = 0;
   while(a < argc ){
      std::cout << argv[a] << std::endl;
      a++;
   }


   return 0;
}