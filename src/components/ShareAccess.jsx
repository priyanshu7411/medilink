import { Share2, Copy, Check, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'qrcode.react'

export default function ShareAccess({ accessCode }) {
  const [copied, setCopied] = useState(false)
  
  const copyCode = () => {
    navigator.clipboard.writeText(accessCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Share2 className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Share Access</h2>
            <p className="text-sm text-gray-500">With healthcare providers</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>Share this code with your doctor</strong> to give them secure access to your complete medical history.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <QRCode value={accessCode} size={180} level="H" />
        </div>
        
        <div className="w-full">
          <p className="text-sm font-medium text-gray-600 mb-3 text-center">
            Or share this code manually:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-2xl font-mono bg-gray-50 px-4 py-3 rounded-lg text-center font-bold text-blue-600 border border-gray-200">
              {accessCode}
            </code>
            <button 
              onClick={copyCode}
              className={`p-3 rounded-lg font-medium transition-all ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-sm mt-2 text-center font-medium">
              ✓ Code copied to clipboard!
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-xs text-yellow-900">
          <strong>🔒 Privacy Note:</strong> Only share this code with trusted healthcare providers.
        </p>
      </div>
    </div>
  )
}
