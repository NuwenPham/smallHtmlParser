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

    boost::regex expression("(?:| +?)([^ .]+) *");
    boost::smatch res;
    boost::regex_match(_tag, res, expression);




    // пример цели поиска: lol="" -> lol
    // var tagName = _tag.match(/(?:| +?)([^ .]+) */i);

}