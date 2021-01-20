import { JobStatus, JobTypes } from './constants'

export class Job {
  public id?: string
  public name: string
  public description?: string
  public type: JobTypes
  public status: JobStatus
  public handler: (...args: any) => any

  constructor(
    name: string,
    type: JobTypes,
    handler: (...args: any) => any,
    description?: string
  ) {
    this.name = name
    this.type = type
    this.handler = handler
    if (description) this.description = description
  }

  async execute(...args: any): Promise<any> {
    return await this.handler.apply(this, ...args)
  }
}
