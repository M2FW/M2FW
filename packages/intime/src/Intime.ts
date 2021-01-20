import schedule, { Job as NodeScheduleJob, RecurrenceRule } from 'node-schedule'

import { Job } from './Job'
import { JobTypes } from './constants'

/*
  *    *    *    *    *    *
  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  │    │    │    │    └───── month (1 - 12)
  │    │    │    └────────── day of month (1 - 31)
  │    │    └─────────────── hour (0 - 23)
  │    └──────────────────── minute (0 - 59)
  └───────────────────────── second (0 - 59, OPTIONAL)
*/
export class Intime {
  public job: Job
  public month?: number
  public day?: number
  public hour?: number
  public minute?: number

  constructor(job: Job) {
    this.job = job
  }

  static getScheduledJobs(): Record<string, NodeScheduleJob> {
    return schedule.scheduledJobs
  }

  static getScheduledJobByName(jobName: string): NodeScheduleJob {
    const scheduledJobs: Record<string, NodeScheduleJob> = Intime.getScheduledJobs()
    if (!scheduledJobs[jobName]) throw new Error(`There's no scheduled job having ${jobName} as its name`)

    return scheduledJobs[jobName]
  }

  static cancelJob(jobName: string): boolean {
    return schedule.cancelJob(Intime.getScheduledJobByName(jobName))
  }

  register(): void {
    if (this.job.type === JobTypes.Recurrence) {
      const rule: RecurrenceRule = this.buildRecurrenceRule()
      schedule.scheduleJob(this.job.name, rule, this.job.handler)
    } else {
      const scheduledDate: Date = this.buildScheduledDate()
      schedule.scheduleJob(this.job.name, scheduledDate, this.job.handler)
    }
  }

  private buildRule(): RecurrenceRule | Date {
    this.checkConditionSufficient()

    if (this.job.type === JobTypes.Recurrence) {
      return this.buildRecurrenceRule()
    } else {
      return this.buildScheduledDate()
    }
  }

  private buildRecurrenceRule(): RecurrenceRule {
    const rule: RecurrenceRule = new RecurrenceRule()
    if (this.month !== undefined) rule.month = this.month
    if (this.day !== undefined) rule.dayOfWeek = this.day
    if (this.hour !== undefined) rule.hour = this.hour
    if (this.minute !== undefined) rule.minute = this.minute

    return rule
  }

  private buildScheduledDate(): Date {
    let scheduledDate: Date = new Date()
    if (this.month !== undefined) scheduledDate.setMonth(this.month)
    if (this.hour !== undefined) scheduledDate.setHours(this.hour)
    if (this.minute !== undefined) scheduledDate.setMinutes(this.minute)

    return scheduledDate
  }

  checkConditionSufficient(): void {
    if (!this.month && !this.day && !this.hour && !this.minute)
      throw new Error('Recurrent schedule should have at least 1 condition')
  }
}
