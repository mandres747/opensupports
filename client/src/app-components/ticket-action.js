import React from 'react';
import classNames from 'classnames';

import i18n from 'lib-app/i18n';
import Icon from 'core-components/icon';

class TicketAction extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf([
            'COMMENT',
            'ASSIGN',
            'UN_ASSIGN',
            'CLOSE',
            'RE_OPEN',
            'DEPARTMENT_CHANGED',
            'PRIORITY_CHANGED'
        ]),
        author: React.PropTypes.object,
        content: React.PropTypes.string,
        date: React.PropTypes.number
    };

    render() {
        let iconNode = null;

        if (this.props.type === 'COMMENT' && this.props.author && this.props.author.staff) {
            iconNode = this.renderStaffPic();
        } else {
            iconNode = this.renderIcon();
        }

        return (
            <div className={this.getClass()}>
                <span className="ticket-action__connector" />
                <div className="col-md-1">
                    {iconNode}
                </div>
                <div className="col-md-11">
                    {this.renderActionDescription()}
                </div>
            </div>
        );
    }

    renderStaffPic() {
        return (
            <div className="ticket-action__staff-pic">
                <img src={this.props.author.profilePic} className="ticket-action__staff-pic-img" />
            </div>
        );
    }

    renderIcon() {
        return (
            <div className="ticket-action__icon">
                <Icon {...this.getIconProps()}/>
            </div>
        );
    }

    renderActionDescription() {
        const renders = {
            'COMMENT': this.renderComment.bind(this),
            'ASSIGN': this.renderAssignment.bind(this),
            'UN_ASSIGN': this.renderUnAssignment.bind(this),
            'CLOSE': this.renderClosed.bind(this),
            'RE_OPEN': this.renderReOpened.bind(this),
            'DEPARTMENT_CHANGED': this.renderDepartmentChange.bind(this),
            'PRIORITY_CHANGED': this.renderPriorityChange.bind(this)
        };

        return renders[this.props.type]();
    }

    renderComment() {
        return (
            <div className="ticket-action__comment">
                <span className="ticket-action__comment-pointer" />
                <div className="ticket-action__comment-author">
                    <span className="ticket-action__comment-author-name">{this.props.author.name}</span>
                    <span className="ticket-action__comment-author-type">({i18n((this.props.author.staff) ? 'STAFF' : 'CUSTOMER')})</span>
                </div>
                <div className="ticket-action__comment-date">{this.props.date}</div>
                <div className="ticket-action__comment-content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                {this.renderFileRow(this.props.file)}
            </div>
        );
    }

    renderAssignment() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> assigned this ticket</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        )
    }

    renderUnAssignment() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> unassigned this ticket</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        )
    }

    renderClosed() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> closed this ticket</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        )
    }

    renderReOpened() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> reopen this ticket</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        );
    }

    renderDepartmentChange() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> change department to</span>
                <span className="ticket-action__circled-indication"> {this.props.content}</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        );
    }

    renderPriorityChange() {
        return (
            <div className="ticket-action__circled">
                <span className="ticket-action__circled-author">{this.props.author.name}</span>
                <span className="ticket-action__circled-text"> change priority to</span>
                <span className="ticket-action__circled-indication"> {this.props.content}</span>
                <span className="ticket-action__circled-date"> on {this.props.date}</span>
            </div>
        );
    }

    renderFileRow(file) {
        let node = null;

        if (file) {
            node = <span> {this.getFileLink(file)} <Icon name="paperclip" /> </span>;
        } else {
            node = i18n('NO_ATTACHMENT');
        }

        return (
            <div className="ticket-viewer__file">
                {node}
            </div>
        )
    }

    getClass() {
        const circledTypes = {
            'COMMENT': false,
            'ASSIGN': true,
            'UN_ASSIGN': true,
            'CLOSE': true,
            'RE_OPEN': true,
            'DEPARTMENT_CHANGED': true,
            'PRIORITY_CHANGED': true
        };
        const classes = {
            'row': true,
            'ticket-action': true,
            'ticket-action_staff': this.props.author && this.props.author.staff,
            'ticket-action_circled': circledTypes[this.props.type],
            'ticket-action_unassignment': this.props.type === 'UN_ASSIGN',
            'ticket-action_close': this.props.type === 'CLOSE',
            'ticket-action_reopen': this.props.type === 'RE_OPEN',
            'ticket-action_department': this.props.type === 'DEPARTMENT_CHANGED',
            'ticket-action_priority': this.props.type === 'PRIORITY_CHANGED'
        };

        return classNames(classes);
    }

    getIconProps() {
        const iconName = {
            'COMMENT': 'comment-o',
            'ASSIGN': 'user',
            'UN_ASSIGN': 'user-times',
            'CLOSE': 'lock',
            'RE_OPEN': 'unlock-alt',
            'DEPARTMENT_CHANGED': 'exchange',
            'PRIORITY_CHANGED': 'exclamation'
        };
        const iconSize = {
            'COMMENT': '2x',
            'ASSIGN': 'lg',
            'UN_ASSIGN': 'lg',
            'CLOSE': 'lg',
            'RE_OPEN': 'lg',
            'DEPARTMENT_CHANGED': 'lg',
            'PRIORITY_CHANGED': 'lg'
        };

        return {
            name: iconName[this.props.type],
            size: iconSize[this.props.type]
        }
    }

    getFileLink(filePath = '') {
        const fileName = filePath.replace(/^.*[\\\/]/, '');

        return (
            <a href={filePath} target="_blank">{fileName}</a>
        )
    }
}

export default TicketAction;