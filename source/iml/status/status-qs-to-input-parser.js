// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import {flow, always} from 'intel-fp';
import {join, assign, like, ends, inList} from 'intel-qs-parsers/qs-to-input-parser.js';
import {qsToInputTokens} from 'intel-qs-parsers/tokens.js';
import * as parsely from 'intel-parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);
const parseStr = parsely.parse(always(''));
const choices = parsely.choice([like, ends, inList, assign]);
const expr = parsely.sepBy1(choices, join);
const emptyOrExpr = parsely.optional(expr);

const statusParser = parseStr([emptyOrExpr, parsely.endOfString]);
export default flow(tokenizer, statusParser, x => x.result);
