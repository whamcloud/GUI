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

import * as fp from '@mfl/fp';
import socketStream from '../socket/socket-stream.js';
import COMMAND_STATES from './command-states.js';
import stepModalTemplate from './assets/html/step-modal.html';

export function StepModalCtrl($scope, stepsStream, jobStream) {
  'ngInject';
  Object.assign(this, {
    steps: [],
    accordion0: true,
    getJobAdjective: function getJobAdjective(job) {
      if (job.state === 'pending') return COMMAND_STATES.WAITING;

      if (job.state !== 'complete') return COMMAND_STATES.RUNNING;

      if (job.cancelled) return COMMAND_STATES.CANCELLED;
      else if (job.errored) return COMMAND_STATES.FAILED;
      else return COMMAND_STATES.SUCCEEDED;
    },
    getDescription: function getDescription(step) {
      return step.description.indexOf(step.class_name) === 0
        ? step.class_name
        : step.description;
    }
  });

  $scope.$on('$destroy', jobStream.destroy.bind(jobStream));
  $scope.$on('$destroy', stepsStream.destroy.bind(stepsStream));

  const p = $scope.propagateChange.bind(null, $scope, this);

  p('job', jobStream);
  p('steps', stepsStream);
}

export function openStepModalFactory($uibModal) {
  'ngInject';
  const extractApiId = fp.map(
    fp.invokeMethod('replace', [/\/api\/step\/(\d+)\/$/, '$1'])
  );

  return function openStepModal(job) {
    const jobStream = socketStream('/job/' + job.id);
    jobStream.write(job);

    const s2 = jobStream.fork();
    s2.destroy = jobStream.destroy.bind(jobStream);

    return $uibModal.open({
      template: stepModalTemplate,
      controller: 'StepModalCtrl',
      controllerAs: 'stepModal',
      windowClass: 'step-modal',
      backdrop: 'static',
      resolve: {
        jobStream: fp.always(s2),
        stepsStream: fp.always(
          jobStream
            .fork()
            .pluck('steps')
            .map(extractApiId)
            .flatMap(function getSteps(stepIds) {
              return socketStream(
                '/step',
                {
                  qs: {
                    id__in: stepIds,
                    limit: 0
                  }
                },
                true
              );
            })
            .pluck('objects')
        )
      }
    });
  };
}
