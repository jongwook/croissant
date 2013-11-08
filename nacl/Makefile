# Copyright (c) 2012 The Native Client Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

#
# GNU Make based build file.  For details on GNU Make see:
# http://www.gnu.org/software/make/manual/make.html
#

#
# Project information
#
# These variables store project specific settings for the project name
# build flags, files to copy or install.  In the examples it is typically
# only the list of sources and project name that will actually change and
# the rest of the makefile is boilerplate for defining build rules.
#
PROJECT:=croissant
CXX_SOURCES:=$(wildcard *.cc)


#
# Get pepper directory for toolchain and includes.
#
# If NACL_SDK_ROOT is not set, then assume it can be found a two directories up,
# from the default example directory location.
#
THIS_MAKEFILE:=$(abspath $(lastword $(MAKEFILE_LIST)))
NACL_SDK_ROOT?=$(abspath $(dir $(THIS_MAKEFILE))../..)

# Project Build flags
WARNINGS := -Wno-long-long -Wall -Wswitch-enum -pedantic
CXXFLAGS := -lpthread -std=gnu++0x $(WARNINGS)

#
# Compute tool paths
#
#
OSNAME:=$(shell python $(NACL_SDK_ROOT)/tools/getos.py)
X86_TC_PATH:=$(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_x86_newlib)
ARM_TC_PATH:=$(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_arm_newlib)
X86_CXX:=$(X86_TC_PATH)/bin/i686-nacl-g++
ARM_CXX:=$(ARM_TC_PATH)/bin/arm-nacl-g++

CXXFLAGS += -I$(NACL_SDK_ROOT)/include
CXXFLAGS += -I$(dir $(THIS_MAKEFILE))include

LDFLAGS:= -lppapi_cpp -lppapi
LDFLAGS+= -lavformat -lavcodec -lavutil -lm -lz

LDFLAGS_X86_32 := -L$(NACL_SDK_ROOT)/lib/newlib_x86_32/Debug
LDFLAGS_X86_32 += -L$(dir $(THIS_MAKEFILE))lib/i686
LDFLAGS_X86_64 := -L$(NACL_SDK_ROOT)/lib/newlib_x86_64/Debug
LDFLAGS_X86_64 += -L$(dir $(THIS_MAKEFILE))lib/x86_64

#
# Disable DOS PATH warning when using Cygwin based tools Windows
#
CYGWIN ?= nodosfilewarning
export CYGWIN


# Declare the ALL target first, to make the 'all' target the default build
all: $(PROJECT)_x86_32.nexe $(PROJECT)_x86_64.nexe

# Define 32 bit compile and link rules for main application
x86_32_OBJS:=$(patsubst %.cc,%_32.o,$(CXX_SOURCES))
$(x86_32_OBJS) : %_32.o : %.cc $(THIS_MAKE)
	$(X86_CXX) -o $@ -c $< -m32 -O0 -g $(CXXFLAGS)

$(PROJECT)_x86_32.nexe : $(x86_32_OBJS)
	$(X86_CXX) -o $@ $^ -m32 -O0 -g $(CXXFLAGS) $(LDFLAGS_X86_32) $(LDFLAGS)

# Define 64 bit compile and link rules for C++ sources
x86_64_OBJS:=$(patsubst %.cc,%_64.o,$(CXX_SOURCES))
$(x86_64_OBJS) : %_64.o : %.cc $(THIS_MAKE)
	$(X86_CXX) -o $@ -c $< -m64 -O0 -g $(CXXFLAGS)

$(PROJECT)_x86_64.nexe : $(x86_64_OBJS)
	$(X86_CXX) -o $@ $^ -m64 -O0 -g $(CXXFLAGS) $(LDFLAGS_X86_64) $(LDFLAGS)

clean: 
	rm -f *.o *.nexe 

X86_CXX?=$(X86_TC_PATH)/$(OSNAME)_x86_newlib/bin/i686-nacl-g++ -c

