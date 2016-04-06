#include "dom_node.h"
//#include "dom_attribute.h"

//DOMNode::DOMNode()
DOMNode::DOMNode(std::string _tag, std::vector<DOMAttribute> attrs, std::string _content)
{

}

DOMNode::~DOMNode()
{

}

std::string DOMNode::getAttr(std::string _attr)
{
    int a = 0;
    while(a < this->attrs.size()) {
        if ( this->attrs[a].name == _attr ) {
            return this->attrs[a].body;
        }
        a++;
    }
}