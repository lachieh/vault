import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | vault/cluster/oidc-callback', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.originalOpener = window.opener;
    window.opener = {
      postMessage: () => {},
    };
    this.route = this.owner.lookup('route:vault/cluster/oidc-callback');
    this.windowStub = sinon.stub(window.opener, 'postMessage');
    this.path = 'oidc';
    this.code = 'lTazRXEwKfyGKBUCo5TyLJzdIt39YniBJOXPABiRMkL0T';
    this.state = (ns) => {
      return ns ? 'st_91ji6vR2sQ2zBiZSQkqJ' + `,ns=${ns}` : 'st_91ji6vR2sQ2zBiZSQkqJ';
    };
  });

  hooks.afterEach(function () {
    this.windowStub.restore();
    window.opener = this.originalOpener;
  });

  test('it calls route', function (assert) {
    assert.ok(this.route);
  });

  test('it uses namespace param from state not namespaceQueryParam from cluster with default path', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: 'admin' };
      return {
        auth_path: this.path,
        state: this.state('admin/child-ns'),
        code: this.code,
      };
    };
    this.route.afterModel();

    assert.ok(this.windowStub.calledOnce, 'it is called');
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: 'lTazRXEwKfyGKBUCo5TyLJzdIt39YniBJOXPABiRMkL0T',
        namespace: 'admin/child-ns',
        path: 'oidc',
        source: 'oidc-callback',
        state: 'st_91ji6vR2sQ2zBiZSQkqJ',
      },
      'namespace param is from state, ns=admin/child-ns'
    );
  });

  test('it uses namespace param from state not namespaceQueryParam from cluster with custom path', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: 'admin' };
      return {
        auth_path: 'oidc-dev',
        state: this.state('admin/child-ns'),
        code: this.code,
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: 'lTazRXEwKfyGKBUCo5TyLJzdIt39YniBJOXPABiRMkL0T',
        namespace: 'admin/child-ns',
        path: 'oidc-dev',
        source: 'oidc-callback',
        state: 'st_91ji6vR2sQ2zBiZSQkqJ',
      },
      'state ns takes precedence, state no longer has ns query'
    );
  });

  test(`it uses namespace from namespaceQueryParam when state does not include: ',ns=some-namespace'`, function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: 'admin' };
      return {
        auth_path: this.path,
        state: this.state(),
        code: this.code,
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: 'lTazRXEwKfyGKBUCo5TyLJzdIt39YniBJOXPABiRMkL0T',
        namespace: 'admin',
        path: 'oidc',
        source: 'oidc-callback',
        state: 'st_91ji6vR2sQ2zBiZSQkqJ',
      },
      'namespace is from cluster namespaceQueryParam'
    );
  });

  test('it uses ns param from state when no namespaceQueryParam from cluster', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: '' };
      return {
        auth_path: this.path,
        state: this.state('ns1'),
        code: this.code,
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: 'lTazRXEwKfyGKBUCo5TyLJzdIt39YniBJOXPABiRMkL0T',
        namespace: 'ns1',
        path: 'oidc',
        source: 'oidc-callback',
        state: 'st_91ji6vR2sQ2zBiZSQkqJ',
      },
      'it strips ns from state and uses as namespace param'
    );
  });

  test('the afterModel hook returns when both cluster and route params are empty strings', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: '' };
      return {
        auth_path: '',
        state: '',
        code: '',
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: '',
        path: '',
        source: 'oidc-callback',
        state: '',
      },
      'model hook returns with empty params'
    );
  });

  test('the afterModel hook returns when state param does not exist', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: '' };
      return {
        auth_path: this.path,
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: undefined,
        path: 'oidc',
        source: 'oidc-callback',
        state: undefined,
      },
      'model hook returns non-existent state param'
    );
  });

  test('the afterModel hook returns when cluster namespaceQueryParam exists and all route params are empty strings', function (assert) {
    this.routeName = 'vault.cluster.oidc-callback';
    this.route.paramsFor = (path) => {
      if (path === 'vault.cluster') return { namespaceQueryParam: 'ns1' };
      return {
        auth_path: '',
        state: '',
        code: '',
      };
    };
    this.route.afterModel();
    assert.propEqual(
      this.windowStub.lastCall.args[0],
      {
        code: '',
        namespace: 'ns1',
        path: '',
        source: 'oidc-callback',
        state: '',
      },
      'model hook returns with empty parameters'
    );
  });
});
