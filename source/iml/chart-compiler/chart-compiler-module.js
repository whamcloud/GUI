// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

import { chartCompilerDirective } from "./chart-compiler-directive";

import highlandModule from "../highland/highland-module";

export default angular.module("chartCompiler", [highlandModule]).directive("chartCompiler", chartCompilerDirective)
  .name;
