const React = require('react');
const TestUtils = require('react-addons-test-utils');
const Header = require('../../components/Header/Header').default;
const expect = require('unexpected')
    .clone()
    .use(require('unexpected-react'))
    .addAssertion('to render as', function (expect, subject, value) {
        let renderer = TestUtils.createRenderer();
        renderer.render(subject);
        return expect(renderer, 'to have rendered', value);
    });

describe('Component: Header', function () {
    it('should render with a default name', function () {
        return expect(<Header />, 'to render as', (
            <div>
                <p>Hello, Gulp</p>
            </div>
        ));
    });
    it('should render with set name', function () {
        return expect(<Header name='Foo' />, 'to render as', (
            <div>
                <p>Hello, Foo</p>
            </div>
        ));
    });
});
