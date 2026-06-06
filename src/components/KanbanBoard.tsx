'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Trash2 } from 'lucide-react';
import { LEAD_STATUS } from '@/utils/constants';

interface KanbanCard {
  id: string;
  title: string;
  company: string;
  score: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

const initialColumns: KanbanColumn[] = LEAD_STATUS.map((status) => ({
  id: status,
  title: status.replace(/_/g, ' ').toUpperCase(),
  cards: [],
}));

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newColumns = { ...columns };
    const sourceColumn = newColumns[source.droppableId as keyof typeof newColumns];
    const destColumn = newColumns[destination.droppableId as keyof typeof newColumns];

    const [removed] = sourceColumn.cards.splice(source.index, 1);
    destColumn.cards.splice(destination.index, 0, removed);

    setColumns(newColumns);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`glass-dark p-4 rounded-lg min-h-96 transition-colors ${
                  snapshot.isDraggingOver ? 'bg-cyan-500/20' : ''
                }`}
              >
                <h3 className="text-sm font-semibold text-white mb-4">{column.title}</h3>

                <div className="space-y-2">
                  {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-slate-800 p-3 rounded-lg cursor-move transition-all ${
                            snapshot.isDragging ? 'shadow-lg shadow-cyan-500/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{card.title}</p>
                              <p className="text-xs text-slate-400 truncate">{card.company}</p>
                            </div>
                            <button className="text-slate-500 hover:text-red-500 transition-colors ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                              Score: {card.score}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>

                <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 border border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors text-sm">
                  <Plus size={16} />
                  Add Card
                </button>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
