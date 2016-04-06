#ifndef DOM_PARSER_H
#define DOM_PARSER_H

#include <string>
#include <vector>
#include <array>
#include "dom_attribute.h"
#include "dom_tag_content.h"

class DOMParser
{
protected:
    const std::array<std::string, 6> single_tags = { { "meta", "br", "img", "options", "input", "!DOCTYPE" } };
public:
    DOMParser();
    ~DOMParser();
    DOMTagContent parseHTMLTag(std::string _tag);
};

#endif
