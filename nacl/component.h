#pragma once

#include <string>

// forward declaration for holding a pointer to it
class CroissantInstance;

// common method for interacting with CroissantInstance
class CroissantComponent {
public:
	CroissantComponent(CroissantInstance *instance);
	virtual ~CroissantComponent() {}

protected:
	inline CroissantInstance* instance() { return instance_; }

public:
	void log  (const std::string &message);
	void trace(const std::string &message);
	void debug(const std::string &message);
	void info (const std::string &message);
	void warn (const std::string &message);
	void error(const std::string &message);
	void alert(const std::string &message);

private:
	CroissantInstance* instance_;
};
