var CommentBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({data: comments});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments:</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} 
                         id={comment.id} > 
                    {comment.text} 
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: "", text: ""};
    },
    changeAuthorState: function(e) {
        this.setState({author: e.target.value});
    },
    changeCommentState: function(e) {
        this.setState({text: e.target.value});
    },
    submit: function(e) {
        e.preventDefault();
        var author = this.state.author;
        var text = this.state.text;
        if (!author || !text) {
            return;
        }

        this.props.onCommentSubmit( {author: author, text: text });
        this.setState({ author: "", text: "" });
    },
    render: function() {
        return(
            <form className="commentForm" onSubmit={this.submit} >
                <input type="text" 
                       placeholder="Your name" 
                       value={this.state.author}
                       onChange={this.changeAuthorState} />
                <input type="text" 
                       placeholder="Your text" 
                       value={this.state.text}
                       onChange={this.changeCommentState} />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return(
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {this.props.children}
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('app')
);