const { ApplicationService } = require('@sap/cds')

class ProcessorService extends ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before("UPDATE", "Incidents", req => this.onUpdate(req))
    this.before("CREATE", "Incidents", ({ data }) => {
      this.autoAssingStatus(data)
      this.changeUrgencyDueToSubject(data)
    })

    return super.init()
  }

  autoAssingStatus(data) {
    if (data) {
      const newIncidents = Array.isArray(data) ? data : [data]
      newIncidents.forEach(incident => {
        incident.status = { code: "N", descr: "New" }
      })
    }
  }

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data]
      incidents.forEach(incident => {
        if (incident.title?.toLowerCase().includes("urgent")) {
          incident.urgency = { code: "H", descr: "High" }
        }
      })
    }
  }

  /** Custom Validation */
  async onUpdate(req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
    if (status_code === 'C')
      return req.reject(`Can't modify a closed incident`)
  }
}
module.exports = ProcessorService