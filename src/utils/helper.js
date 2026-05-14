export const Helper = {
  getInitials(name) {
    if (!name) return ''
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  },

  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  },

  formatDate(date, format = 'dd/MM/yyyy') {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    if (format === 'dd/MM/yyyy') return `${day}/${month}/${year}`
    if (format === 'yyyy-MM-dd') return `${year}-${month}-${day}`
    return date
  },

  formatAddress(address) {
    if (!address) return '-'
    // Thay thế dấu # thành dấu phẩy
    return address.replace(/ #/g, ',')
  },

  formatUpperCase(text) {
    if (!text) return ''
    return text.toUpperCase()
  }
}
