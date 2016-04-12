const React = require('react');
const TestUtils = require('react-addons-test-utils');
const Home = require('../../components/Home/Home').default;
const expect = require('unexpected')
    .clone()
    .use(require('unexpected-react'))
    .addAssertion('to render as', function (expect, subject, value) {
        let renderer = TestUtils.createRenderer();
        renderer.render(subject);
        return expect(renderer, 'to have rendered', value);
    });

describe('Component: Home', function () {
    it('should render with a default name', function () {
        return expect(<Home />, 'to render as', (
            <div>
                <p>Hello, Gulp</p>
            </div>
        ));
    });
    it('should render with set name', function () {
        return expect(<Home name='Foo' />, 'to render as', (
            <div>
                <p>Hello, Foo</p>
            </div>
        ));
    });
});
