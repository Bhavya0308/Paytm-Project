export const InputBox = ({ title, placeholder, value }) => {
    return <div>
        <div className="text-sm font-medium text-left py-2">{title}</div>
        <input type="text" className="w-full px-2 py-1 border rounded border-slate-200" placeholder={placeholder} value={value} />
    </div>
}