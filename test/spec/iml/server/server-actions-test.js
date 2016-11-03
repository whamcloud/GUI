import serverModule from '../../../../source/iml/server/server-module';

describe('server actions', () => {
  let serverActions,
    hosts,
    detectFs,
    rewriteTargetConfig,
    installUpdates;

  beforeEach(module(serverModule));

  beforeEach(inject(_serverActions_ => {
    serverActions = _serverActions_;

    hosts = [
      {
        id: 1,
        resource_uri: '/api/host/1',
        server_profile: {
          managed: true
        }
      }
    ];

    detectFs = serverActions[0];
    rewriteTargetConfig = serverActions[1];
    installUpdates = serverActions[2];
  }));

  it('should be an array', () => {
    expect(serverActions).toEqual(jasmine.any(Array));
  });

  it('should contain actions', () => {
    expect(serverActions).toEqual([
      {
        value: 'Detect File Systems',
        message: 'Detecting File Systems',
        helpTopic: 'detect_file_systems-dialog',
        buttonTooltip: jasmine.any(Function),
        jobClass: 'DetectTargetsJob',
        convertToJob: jasmine.any(Function)
      },
      {
        value: 'Re-write Target Configuration',
        message: 'Updating file system NIDs',
        helpTopic: 'rewrite_target_configuration-dialog',
        buttonTooltip: jasmine.any(Function),
        buttonDisabled: jasmine.any(Function),
        toggleDisabledReason: jasmine.any(Function),
        toggleDisabled: jasmine.any(Function),
        jobClass: 'UpdateNidsJob',
        convertToJob: jasmine.any(Function)
      },
      {
        value: 'Install Updates',
        message: 'Install updates',
        helpTopic: 'install_updates_dialog',
        buttonTooltip: jasmine.any(Function),
        buttonDisabled: jasmine.any(Function),
        toggleDisabledReason: jasmine.any(Function),
        toggleDisabled: jasmine.any(Function),
        jobClass: 'UpdateJob',
        convertToJob: jasmine.any(Function)
      }
    ]);
  });

  it('should convert detect file systems hosts to a job', () => {
    const result = detectFs.convertToJob(hosts);

    expect(result).toEqual([{
      class_name: 'DetectTargetsJob',
      args: {
        hosts: [ '/api/host/1' ]
      }
    }]);
  });

  it('should check if a re-write target configuration host is disabled', () => {
    const result = rewriteTargetConfig.buttonDisabled(hosts);

    expect(result).toBe(false);
  });

  it('should convert install updates hosts to a job', () => {
    const result = installUpdates.convertToJob(hosts);

    expect(result).toEqual([{
      class_name: 'UpdateJob',
      args: {
        host_id: 1
      }
    }]);
  });
});
