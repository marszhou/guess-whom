import _ from 'lodash'

let Page = {
  titles: [],

  pushTitle(title) {
    _.delay(() => {
      this.titles.unshift(title)
      this.renderTitle()
    })
  },

  popTitle(title) {
    this.titles.shift()
    this.renderTitle()
  },

  renderTitle() {
    document.title = this.titles.join(' - ')
  }
}

export default Page