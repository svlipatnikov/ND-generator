class Element {
  name = ''
  attributes = {}
  children = []

  constructor(name, attributes) {
    this.name = name
    this.attributes = attributes
  }

  get name() {
    return this.name
  }

  addAttributes(att = {}) {
    try {
      this.attributes = { ...this.attributes, ...att }
    } catch (err) {
      console.log('Add attributes error: ', err)
    }
  }

  addChild(element) {
    try {
      this.children = [...this.children, element]
    } catch (err) {
      console.log('Add child error')
    }
  }

  addChildren(elementsArr) {
    elementsArr.forEach(element => this.addChild(element))
  }

  getChild(name) {
    this.children.find(child => child.name === name)
    return child
  }

  toObject() {
    const result = {
      _attributes: this.attributes,
    }

    const childrenMap = this.children.reduce((acc, child) => {
      if (acc[child.name]) acc[child.name] = [...acc[child.name], child]
      else acc[child.name] = [child]
      return acc
    }, {})

    Object.entries(childrenMap).map(([name, elements]) => {
      if (elements.length > 1) result[name] = elements.map((el) => el.toObject())
      else result[name] = elements[0].toObject()
    })

    return result
  }
}

module.exports = Element
