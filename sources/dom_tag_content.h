#ifndef DOM_TAG_CONTENT_H
#define DOM_TAG_CONTENT_H

#include <string>
#include <vector>
#include "dom_attribute.h"

class DOMTagContent
{
public:
    std::string name;
    std::string status;
    std::vector<DOMAttribute> attrs;
};

#endif
