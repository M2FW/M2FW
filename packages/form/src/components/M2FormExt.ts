export class M2FormExt extends HTMLFormElement {
  /**
   * @description Serialize form value
   * @returns object
   */
  serialize(withEmptyValue: boolean = false): object {
    const fields: (HTMLInputElement | HTMLSelectElement)[] = this.getFields()

    return fields.reduce(
      (
        formData: { [key: string]: any },
        field: HTMLInputElement | HTMLSelectElement
      ): object => {
        if (withEmptyValue) {
          formData[field.name] = this.getValue(field)
        } else {
          const value: any = this.getValue(field)
          if (value != undefined) {
            formData[field.name] = this.getValue(field)
          }
        }

        return formData
      },
      {}
    )
  }

  /**
   * @description Fill up form by passed object
   * @param obj Data object to fill up form fields
   */
  fillUp(obj: object): void {
    for (let key in obj) {
      const field: HTMLInputElement | HTMLSelectElement = this.getField(key)

      if (field instanceof HTMLInputElement) {
        field.value = obj[key] || ''
      } else if (field instanceof HTMLSelectElement) {
        Array.from(field.options).find((option: HTMLOptionElement) => {
          if (option.value === obj[key].id) {
            return option
          }
        }).selected = true
      }
    }
  }

  /**
   * @description return every input or select elements
   */
  getFields(): (HTMLInputElement | HTMLSelectElement)[] {
    return Array.from(this.querySelectorAll('input, select'))
  }

  /**
   * @description find out input or select element by propValue and prop
   *
   * @param propValue value for find out input or select element
   * @param prop type of property for adding condition to find out input or select element
   */
  getField(
    propValue: string,
    prop: string = 'name'
  ): HTMLInputElement | HTMLSelectElement {
    return this.querySelector(
      `input[${prop}=${propValue}], select[${prop}=${propValue}]`
    )
  }

  /**
   * @description find out value of input or select element
   * @param param name of element or element itself
   */
  getValue(param: string | HTMLInputElement | HTMLSelectElement): any {
    let element: HTMLInputElement | HTMLSelectElement
    let value: any = undefined

    if (param instanceof String) {
      element = this.getField(this.name)
    } else {
      element = param as HTMLInputElement | HTMLSelectElement
    }

    if (element instanceof HTMLInputElement) {
      switch (element.type) {
        case 'number':
          if (element.value) {
            value = Number(element.value)
          }
          break

        case 'checkbox':
          value = Boolean(element.checked)
          break

        default:
          value = element?.value || undefined
          break
      }
    } else if (element instanceof HTMLSelectElement) {
      if (element.value) {
        value = { id: element.value }
      }
    }

    return value
  }
}

window.customElements.define('m2-form-ext', M2FormExt, { extends: 'form' })
