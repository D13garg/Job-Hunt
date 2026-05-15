const styles = {
  in_progress: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  shortlisted: 'bg-green-900/40  text-green-300  border-green-700',
  rejected:    'bg-red-900/40    text-red-300    border-red-700',
}

const labels = {
  in_progress: 'In Progress',
  shortlisted: 'Shortlisted',
  rejected:    'Rejected',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`badge border ${styles[status] || 'bg-slate-700 text-slate-300'}`}>
      {labels[status] || status}
    </span>
  )
}
