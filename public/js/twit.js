// PageContainer has 3 children
// SearchBox gets user requests, pipes them back to PageContainer
// Sidebar displays info for current user
// Timeline displays most recent commits for user

// Data flow:
//

var SearchBox = React.createClass({
    displayName: "SearchBox",

    getInitialState: function () {
        return {
            error: false,
            user: {
                avatar_url: "https://avatars.githubusercontent.com/u/8053315?v=3",
                html_url: "https://github.com/rgscherf",
                login: "rgscherf",
                name: "Rob Scherf",
                public_repos: 14
            }
        };
    },
    keyDown: function (e) {
        if (e.key === 'Enter') {
            var s = e.target.value;
            this.loadCommentsFromServer(s);
        }
    },
    loadCommentsFromServer: function (query) {
        // var u = 'http://localhost:5000/index.php/twit/' + query;
        var u = 'https://phptwit.herokuapp.com/index.php/twit/' + query;
        console.log(u);
        $.ajax(u, {
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.log(data);
                this.setState({ user: data, error: false });
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({ error: true });
            }.bind(this)
        });
    },
    render: function () {
        var err = this.state.error ? "Could not find that github user!" : "";
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "searchBox shadow" },
                React.createElement(
                    "div",
                    { className: "titleBox" },
                    React.createElement(
                        "div",
                        { id: "logo" },
                        "Twit"
                    ),
                    React.createElement(
                        "div",
                        { id: "definition" },
                        React.createElement(
                            "i",
                            null,
                            "V.  to taunt or ridicule ",
                            React.createElement("br", null),
                            "with reference to anything embarrassing"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "searchContainer" },
                    React.createElement("input", { type: "text",
                        placeholder: "Find a github user to twit",
                        className: "mainSearch",
                        onKeyDown: this.keyDown }),
                    React.createElement(
                        "div",
                        { className: "searchError" },
                        err
                    )
                )
            ),
            React.createElement(ContentContainer, { user: this.state.user })
        );
    }

});

var ContentContainer = React.createClass({
    displayName: "ContentContainer",

    render: function () {
        return React.createElement(
            "div",
            { className: "contentContainer" },
            React.createElement(Sidebar, { user: this.props.user }),
            React.createElement(Timeline, null)
        );
    }
});

var Sidebar = React.createClass({
    displayName: "Sidebar",

    render: function () {
        return React.createElement(
            "div",
            { className: "sideBar shadow" },
            React.createElement("img", { src: this.props.user.avatar_url }),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { id: "userName" },
                    this.props.user.name
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { id: "userUrl" },
                    React.createElement(
                        "a",
                        { href: this.props.user.html_url },
                        this.props.user.login
                    ),
                    " - ",
                    this.props.user.public_repos,
                    " public repos"
                )
            )
        );
    }
});

var Timeline = React.createClass({
    displayName: "Timeline",

    render: function () {
        return React.createElement(
            "div",
            { className: "timeline" },
            React.createElement(
                "p",
                null,
                "This is your pilot speaking, from the timeline view..."
            )
        );
    }
});

ReactDOM.render(React.createElement(SearchBox, null), document.getElementById("app"));