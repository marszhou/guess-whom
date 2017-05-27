import React from 'react'
import {observable, action} from 'mobx'
import {inject, observer} from 'mobx-react'
import cx from 'classnames'
import _ from 'lodash'

import Page from 'src/stores/Page'

@inject('game')
@observer
class PlayerAnswer extends React.Component{
  componentWillMount() {
    let {player} = this.props.game
    if (player.answers.length === 0) {
      player.addAnswer('小时候')
      player.addAnswer('现在')
    }
    Page.pushTitle('设置答案')
  }

  componentWillUnmount() {
    Page.popTitle()
  }

  handleChange = (index, field, e) => {
    let {player} = this.props.game
    player.updateAnswer(index, field, e.target.value)
  }

  handleAddItem = () => {
    let {player} = this.props.game
    player.addAnswer()
  }

  handleRemoveItem = (index) => {
    let {player} = this.props.game
    player.removeAnswer(index)
  }

  @observable error = null

  @action
  handleSubmit = () => {
    let {player} = this.props.game
    this.error = player.checkAnswers()

    if (!this.error) {
      player.sendAnswers()
    }
  }

  handleCancel = () => {
    let {player} = this.props.game
    player.cancelAnswers()
  }

  renderItem = (item, index) => {
    let {player} = this.props.game
    let validate = player.answerValidates[index]

    return (
      <div key={index}>
        <legend>
          选项{index + 1}
          <button type='button' className='btn btn-danger btn-link pull-right'><span className='glyphicon glyphicon-trash' onClick={_.partial(this.handleRemoveItem, index)}/></button>
        </legend>

        <div className={cx({
          "form-group": true,
          "has-error": !validate.period
        })}>
          <label className="col-sm-2 control-label">
            时期
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="例如：从前, 小时候，初中，大学等描述"
              name='period'
              value={item.period}
              readOnly={player.isSurvey}
              onChange={_.partial(this.handleChange, index, 'period')}
            />

          </div>

        </div>

        <div className={cx({
          "form-group": true,
          "has-error": !validate.target
        })}>
          <label className="col-sm-2 control-label">
            谁是你的榜样？
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="对象可以是任何人，按自己的实际情况填写"
              name='target'
              value={item.target}
              readOnly={player.isSurvey}
              onChange={_.partial(this.handleChange, index, 'target')}
            />

          </div>
        </div>

        {
          (index !== player.answers.length - 1)
            ? (<hr/>) : null
        }
      </div>
    )
  }

  renderFormCheckError() {
    return this.error ? (
      <div className="alert alert-danger" role="alert">
        {this.error.message}
      </div>
    ) : null
  }

  render() {
    let {player} = this.props.game

    return (
      <div>
        <form className="form-horizontal">
          <div id="legend">
          <legend>人生的不同阶段，我们可能会有不同的<span style={{color: 'red'}}>榜样</span>，请填写下面的选项，至少填两项：</legend>
          </div>
          {
            player.answers.map(this.renderItem)
          }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.handleAddItem}
              >
                添加选项
              </button>
            </div>
          </div>

          { this.renderFormCheckError() }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.handleSubmit}
                disabled={player.isSurvey}
              >
              {
                player.isSurvey ? (
                  <span>
                    准备就绪
                    <img src="static/assets/svg/loading-bubbles.svg" alt="Loading icon" style={{width: 16}}/>
                  </span>
                ) : '确认'
              }
              </button>
            </div>
          </div>

          {
            player.isSurvey ? (<div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button
                  type="button"
                  className="btn btn-info btn-block"
                  onClick={this.handleCancel}
                >
                  继续修改
                </button>
              </div>
            </div>) : null
          }
        </form>
      </div>
    )
  }
}

export default PlayerAnswer