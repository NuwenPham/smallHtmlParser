#ifndef DOM_NODE
#define DOM_NODE

#include <string>
#include <vector>
#include "dom_attribute.h"

class DOMNode
{
protected:
    std::string tag, _content;
    std::vector<DOMAttribute> attrs;
    std::vector<DOMNode> children;
public:
    //DOMNode();
    DOMNode(std::string _tag, std::vector<DOMAttribute> attrs, std::string _content);
    ~DOMNode();
    void addChild(DOMNode _node);
    std::string getAttr(std::string _attr);
};

#endif
