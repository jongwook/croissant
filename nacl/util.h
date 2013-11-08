#pragma once

#include <string>
#include <cstring>
#include <sstream>

void croissant_log(const std::string& message);

template <typename T>
inline std::string to_string(T n) {
	std::stringstream ss;
	ss << n;
	return ss.str();
}
