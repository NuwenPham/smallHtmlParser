#ifndef DOM_TREE
#define DOM_TREE

#include <string>
#include <vector>
#include "dom_node.h"
class DOMTree
{
protected:
   DOMNode* rootNode;
   std::vector<DOMNode*> nodeCollection;
public:
    DOMTree();
    ~DOMTree();
    void build(std::string _html_source);
};
#endif