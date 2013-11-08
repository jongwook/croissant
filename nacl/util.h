#include <string>
#include <sstream>

template <typename T>
inline std::string to_string(T n) {
	std::stringstream ss;
	ss << n;
	return ss.str();
}
