export default function Alert({ type = 'error', children }) {
  return (
    <div className={`alert alert-${type}`}>
      {type === 'error' ? '⚠️' : '✓'} {children}
    </div>
  );
}
