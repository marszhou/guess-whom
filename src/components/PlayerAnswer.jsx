import React from 'react'
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

  handleChange() {

  }

  handleAddItem = () => {
    let {player} = this.props.game
    player.addAnswer()
  }

  handleRemoveItem = (index) => {
    let {player} = this.props.game
    player.removeAnswer(index)
  }

  handleSubmit() {

  }

  renderItem = (item, index) => {
    let {player} = this.props.game

    return (
      <div key={index}>
        <legend>
          选项{index + 1}
          <button type='button' className='btn btn-danger btn-link pull-right'><span className='glyphicon glyphicon-trash' onClick={_.partial(this.handleRemoveItem, index)}/></button>
        </legend>

        <div className={cx({
          "form-group": true,
        })}>
          <label className="col-sm-2 control-label">
            时期
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="例如：从前, 小时候，初中，大学等描述"
              name='name'
              value={item.period}
              onChange={_.partial(this.handleChange, index)}
            />

          </div>

        </div>

        <div className={cx({
          "form-group": true,
        })}>
          <label className="col-sm-2 control-label">
            榜样
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="对象可以是任何人，按自己的实际情况填写"
              name='name'
              value={item.target}
              onChange={_.partial(this.handleChange, index)}
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

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.handleSubmit}
              >
                确认
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default PlayerAnswer