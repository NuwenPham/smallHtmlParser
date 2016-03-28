#ifndef DOM_TREE
#define DOM_TREE

#include <string>
class DOMTree
{
public:
    DOMTree();
    ~DOMTree();
    void build(std::string _html_source);
};
#endif