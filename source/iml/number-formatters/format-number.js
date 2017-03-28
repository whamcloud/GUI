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

import * as fp from 'intel-fp';

import global from '../global.js';

const units = ['', 'k', 'M', 'B', 'T'];
const is2or3 = fp.or([fp.eq(2), fp.eq(3)]);
const is5or10 = fp.or([fp.eq(5), fp.eq(10)]);
const toPrecision = fp.invokeMethod('toPrecision');
const test = fp.bindMethod('test');
const toString = fp.invokeMethod('toString', []);
const round = x => Math.round(x);
const endDotZero = /\.0/;
const containsDot = /\./;
const beginZeroDot = /^0./;
const notBeginZeroPlus = /[^0+$]/;
const notBeginZeroAndContainsDot = fp.and([
  test(notBeginZeroPlus),
  test(containsDot)
]);
const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

export default function formatNumber(
  num: number,
  precision: number,
  strict: boolean
) {
  num = isNumeric(num) ? num : 0;
  precision = isNumeric(precision) ? precision : 3;

  const sign = num < 0 ? '-' : '';
  num = Math.abs(num);

  let pwr = Math.floor(Math.log(num) / Math.log(1000));

  pwr = Math.min(pwr, units.length - 1);
  pwr = Math.max(pwr, 0);
  num /= Math.pow(1000, pwr);

  if (global.Intl) return formatIntl();
  else return formatCustom();

  function formatCustom() {
    const numStringArr = [toString(num)];
    const alwaysNormal = fp.always(toPrecision([precision], num));
    const alwaysParseRoundOne = fp.always(
      parseFloat(round(num).toPrecision(1))
    );
    const alwaysParseRoundOneFor = [
      notBeginZeroAndContainsDot,
      alwaysParseRoundOne
    ];
    const strictCond = fp.cond(
      [test(endDotZero), alwaysNormal],
      alwaysParseRoundOneFor
    );
    const standardCond = fp.cond(
      [test(beginZeroDot), alwaysNormal],
      alwaysParseRoundOneFor,
      [test(containsDot), alwaysNormal]
    );
    const standardPrecisionCond = fp.cond(
      [fp.eq(1), fp.always(standardCond(numStringArr))],
      [is2or3, fp.always(+num.toPrecision(precision).toString())],
      [is5or10, fp.always(toPrecision([])(num))]
    );
    const standardOrStrict = fp.cond(
      [fp.eq(true), strictPrecision],
      [fp.always(true), fp.always(standardPrecisionCond(precision))]
    );

    return sign + standardOrStrict(strict) + units[pwr];

    function strictPrecision() {
      if (fp.eq(1, precision)) return strictCond(numStringArr);

      return toPrecision([precision], num);
    }
  }

  function formatIntl() {
    type formatOptionsT = {
      maximumSignificantDigits?: number,
      maximumFractionDigits?: number,
      minimumSignificantDigits?: number
    };
    const formatOptions: formatOptionsT = {
      maximumSignificantDigits: precision,
      maximumFractionDigits: precision
    };

    if (strict) formatOptions.minimumSignificantDigits = precision;

    const formatter = new global.Intl.NumberFormat('en-us', formatOptions);

    return sign + formatter.format(num) + units[pwr];
  }
}
