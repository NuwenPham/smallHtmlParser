#include <string>
#include <vector>
#include "dom_parser.h"
#include "dom_tag_content.h"
#include "dom_attribute.h"
#include <boost/regex.hpp>

DOMParser::DOMParser()
{

}

DOMParser::~DOMParser()
{

}

DOMTagContent DOMParser::parseHTMLTag(std::string _tag)
{
    std::string match;
    std::string tag = _tag;
    std::vector<DOMAttribute*> attrs;
}