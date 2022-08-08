Ext.Loader.syncRequire(['BasiGX.view.form.AddArcGISRest', 'Ext.Promise']);

describe('BasiGX.view.form.AddArcGISRest', function() {
    describe('Basics', function() {
        it('is defined', function() {
            expect(BasiGX.view.form.AddArcGISRest).to.not.be(undefined);
        });

        it('can be instantiated', function() {
            var inst = Ext.create('BasiGX.view.form.AddArcGISRest');
            expect(inst).to.be.a(BasiGX.view.form.AddArcGISRest);
            // teardown
            inst.destroy();
        });
    });

    describe('Rendering', function() {
        var form = null;
        beforeEach(function() {
            form = Ext.create('BasiGX.view.form.AddArcGISRest', {
                renderTo: Ext.getBody()
            });
        });
        afterEach(function() {
            if (form) {
                form.destroy();
                form = null;
            }
        });

        it('can be rendered', function() {
            expect(form).to.be.a(BasiGX.view.form.AddArcGISRest);
        });
        it('id attribute looks as expected', function() {
            var gotId = form.getEl().id;
            expect(/^basigx-form-addarcgisrest/.test(gotId)).to.be(true);
        });
        it('renders both a textfield and a combo by default', function() {
            var textfield = form.down('textfield[name="url"]');
            expect(textfield).to.be.ok();
            expect(textfield).to.be.an(Ext.form.field.Text);

            var combo = form.down('combo[name="urlCombo"]');
            expect(combo).to.be.ok();
            expect(combo).to.be.an(Ext.form.field.ComboBox);
        });

        it('ensures only one of combo/textfield is visible', function() {
            var textfield = form.down('textfield[name="url"]');
            var combo = form.down('combo[name="urlCombo"]');
            expect(textfield.isVisible()).to.not.be(combo.isVisible());
        });

        it('renders the textfield if no arcGISBaseUrls', function() {
            var textfield = form.down('textfield[name="url"]');
            var combo = form.down('combo[name="urlCombo"]');
            expect(textfield.isVisible()).to.be(true);
            expect(combo.isVisible()).to.be(false);
        });

        it('renders the combo if some arcGISBaseUrls', function() {
            form.destroy();
            form = Ext.create('BasiGX.view.form.AddArcGISRest', {
                renderTo: Ext.getBody(),
                arcGISBaseUrls: ['foo', 'fighter']
            });
            var textfield = form.down('textfield[name="url"]');
            var combo = form.down('combo[name="urlCombo"]');
            expect(textfield.isVisible()).to.be(false);
            expect(combo.isVisible()).to.be(true);
        });

        it('can be configured with a default URL (textfield)', function() {
            form.destroy();
            form = Ext.create('BasiGX.view.form.AddArcGISRest', {
                renderTo: Ext.getBody(),
                defaultUrl: 'Peter'
            });
            var textfield = form.down('textfield[name="url"]');
            expect(textfield.getValue()).to.be('Peter');
        });

        it('can be configured with a default URL (combo)', function() {
            form.destroy();
            form = Ext.create('BasiGX.view.form.AddArcGISRest', {
                renderTo: Ext.getBody(),
                defaultUrl: 'Kalle'
            });
            var combo = form.down('combo[name="urlCombo"]');
            expect(combo.getValue()).to.be('Kalle');
        });

    });

    describe('Methods', function() {
        var form = null;
        beforeEach(function() {
            form = Ext.create('BasiGX.view.form.AddArcGISRest', {
                renderTo: Ext.getBody()
            });
        });
        afterEach(function() {
            if (form) {
                form.destroy();
                form = null;
            }
        });
        describe('responseStatusToErrorMsgKey', function() {
            it('returns a key for CORS status', function() {
                var exp = 'msgCorsMisconfiguration';
                expect(form.responseStatusToErrorMsgKey(0)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('0')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for unauthorized error status', function() {
                var exp = 'msgUnauthorized';
                expect(form.responseStatusToErrorMsgKey(401)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('401')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for forbidded error status', function() {
                var exp = 'msgForbidden';
                expect(form.responseStatusToErrorMsgKey(403)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('403')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for file not found error status', function() {
                var exp = 'msgFileNotFound';
                expect(form.responseStatusToErrorMsgKey(404)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('404')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for too many requests error status', function() {
                var exp = 'msgTooManyRequests';
                expect(form.responseStatusToErrorMsgKey(429)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('429')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for service unavailable error status', function() {
                var exp = 'msgServiceUnavailable';
                expect(form.responseStatusToErrorMsgKey(503)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('503')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns a key for gateway timeout error status', function() {
                var exp = 'msgGatewayTimeOut';
                expect(form.responseStatusToErrorMsgKey(504)).to.be(exp);
                expect(form.responseStatusToErrorMsgKey('504')).to.be(exp);
                expect(form.getViewModel().get(exp)).to.be.ok();
            });
            it('returns null for unexpected status', function() {
                var exp = null;
                var checks = [
                    -1, 'humpty', false, NaN, [], {}, function() { }
                ];
                Ext.each(checks, function(check) {
                    expect(form.responseStatusToErrorMsgKey(check)).to.be(exp);
                    expect(form.responseStatusToErrorMsgKey('' + check)).to.be(exp);
                });
            });
        });
        describe('responseStatusToErrorMsgKey', function() {
            it('returns a generic key for client error status', function() {
                var exp = 'msgClientError';
                var checks = [
                    400, 410, 450, 465, 499
                ];
                Ext.each(checks, function(check) {
                    expect(form.responseStatusToErrorMsgKey(check)).to.be(exp);
                    expect(form.responseStatusToErrorMsgKey('' + check)).to.be(exp);
                    expect(form.getViewModel().get(exp)).to.be.ok();
                });
            });
        });
        describe('responseStatusToErrorMsgKey', function() {
            it('returns a generic key for server error status', function() {
                var exp = 'msgServerError';
                var checks = [
                    500, 510, 550, 565, 664, 799
                ];
                Ext.each(checks, function(check) {
                    expect(form.responseStatusToErrorMsgKey(check)).to.be(exp);
                    expect(form.responseStatusToErrorMsgKey('' + check)).to.be(exp);
                    expect(form.getViewModel().get(exp)).to.be.ok();
                });
            });
        });
    });
});
