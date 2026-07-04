import React, { useState } from 'react'

export default function RSVP(){
  const [form, setForm] = useState({ name:'', email:'', attend:'yes', message:'' })
  const [status, setStatus] = useState({ sent:false, loading:false, error:null })

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ sent:false, loading:true, error:null })
    try {
      const res = await fetch('/.netlify/functions/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setStatus({ sent:true, loading:false, error:null })
      } else {
        throw new Error(json.error || 'Unknown error')
      }
    } catch (err) {
      console.error(err)
      setStatus({ sent:false, loading:false, error: err.message })
    }
  }

  if (status.sent) return (
    <div className="glass p-6 rounded-xl gold-frame text-center my-8" data-aos="fade-up">
      <h4 className="font-medium">Terima kasih!</h4>
      <p className="text-sm mt-2">Konfirmasi kamu telah tercatat.</p>
    </div>
  )

  return (
    <section className="my-10" data-aos="fade-up">
      <h3 className="h2 text-2xl mb-6">RSVP</h3>
      <form onSubmit={submit} className="glass p-6 rounded-xl gold-frame space-y-4">
        <input required className="w-full p-3 rounded-md bg-maroon/70 border border-gold/15" placeholder="Nama Lengkap" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input required type="email" className="w-full p-3 rounded-md bg-maroon/70 border border-gold/15" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <div className="flex gap-3">
          <label className="poppins"><input type="radio" name="attend" value="yes" checked={form.attend==='yes'} onChange={e=>setForm({...form,attend:e.target.value})} /> Hadir</label>
          <label className="poppins"><input type="radio" name="attend" value="no" checked={form.attend==='no'} onChange={e=>setForm({...form,attend:e.target.value})} /> Tidak Bisa</label>
        </div>
        <textarea className="w-full p-3 rounded-md bg-maroon/70 border border-gold/15" placeholder="Ucapan / Pesan" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
        {status.error && <div className="text-sm text-rose-300">{status.error}</div>}
        <div className="flex justify-end">
          <button disabled={status.loading} className="px-4 py-2 rounded-full bg-gold text-maroon font-semibold">
            {status.loading ? 'Mengirim...' : 'Kirim RSVP'}
          </button>
        </div>
      </form>
    </section>
  )
}
