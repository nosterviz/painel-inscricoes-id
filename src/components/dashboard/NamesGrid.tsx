import React, { useState } from 'react';
import { Search, UserCheck, X } from 'lucide-react';

interface NamesGridProps {
  names: string[];
}

export function NamesGrid({ names }: NamesGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = (names || []).filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111827] border border-white/5 rounded-full pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#2BBDCE]/40 transition-all shadow-lg"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          {searchTerm ? (
            <span className="text-[#2BBDCE] font-bold">
              {filteredNames.length} resultados
            </span>
          ) : (
            <span>{names?.length || 0} inscritos registrados</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        {filteredNames.length > 0 ? (
          filteredNames.map((name, idx) => (
            <div 
              key={`${name}-${idx}`}
              title={name}
              className="group relative bg-[#111827] p-4 flex items-center gap-3 transition-all duration-300 hover:translate-y-[-2px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2BBDCE]/40 group-hover:text-[#2BBDCE]" />
              <span className="text-[13px] text-zinc-400 font-medium truncate group-hover:text-white">
                {name}
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#2BBDCE]/30 transition-all duration-300 group-hover:w-full" />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-[#111827] flex flex-col items-center justify-center text-zinc-600">
            <Search size={40} className="mb-4 opacity-10" />
            <p className="font-mono text-xs uppercase tracking-widest">
              Nenhum resultado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
