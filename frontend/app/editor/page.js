'use client';

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DocEditor() {
  const [pages, setPages] = useState([{ id: 1, content: '' }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showTableStyleModal, setShowTableStyleModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const editorRef = useRef(null);

  const currentPage = pages[currentPageIndex];

  // Handle content change
  const handleContentChange = () => {
    if (editorRef.current) {
      const newPages = [...pages];
      newPages[currentPageIndex].content = editorRef.current.innerHTML;
      setPages(newPages);
    }
  };

  // Format commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Add new page
  const addNewPage = () => {
    const newPage = {
      id: pages.length + 1,
      content: ''
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  // Delete current page
  const deletePage = () => {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, index) => index !== currentPageIndex);
    setPages(newPages);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  // Navigate pages
  const goToPage = (index) => {
    setCurrentPageIndex(index);
  };

  // Insert Table
  const insertTable = () => {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginTop = '10px';
    table.style.marginBottom = '10px';
    table.setAttribute('data-table-id', Date.now().toString());
    
    for (let i = 0; i < tableRows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < tableCols; j++) {
        const cell = row.insertCell();
        cell.innerHTML = '&nbsp;';
        cell.style.border = '1px solid #d4d4d4';
        cell.style.padding = '8px';
        cell.style.minWidth = '80px';
        cell.contentEditable = 'true';
      }
    }
    
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, table.outerHTML);
    setShowTableModal(false);
    handleContentChange();
  };

  // Get selected table
  const getSelectedTable = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    
    let node = selection.getRangeAt(0).startContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TABLE') {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  // Open table style modal
  const openTableStyleModal = () => {
    const table = getSelectedTable();
    if (table) {
      setSelectedTable(table);
      setShowTableStyleModal(true);
    } else {
      alert('Please click inside a table to style it');
    }
  };

  // Apply table border style
  const applyTableBorderStyle = (style) => {
    if (!selectedTable) return;
    
    const cells = selectedTable.querySelectorAll('td, th');
    cells.forEach(cell => {
      switch(style) {
        case 'all':
          cell.style.border = '1px solid #d4d4d4';
          break;
        case 'none':
          cell.style.border = 'none';
          break;
        case 'outer':
          cell.style.border = 'none';
          selectedTable.style.border = '1px solid #d4d4d4';
          break;
        case 'horizontal':
          cell.style.border = 'none';
          cell.style.borderTop = '1px solid #d4d4d4';
          cell.style.borderBottom = '1px solid #d4d4d4';
          break;
        case 'vertical':
          cell.style.border = 'none';
          cell.style.borderLeft = '1px solid #d4d4d4';
          cell.style.borderRight = '1px solid #d4d4d4';
          break;
        case 'header':
          cell.style.border = 'none';
          if (cell.parentElement.rowIndex === 0) {
            cell.style.borderBottom = '2px solid #171717';
            cell.style.fontWeight = 'bold';
            cell.style.backgroundColor = '#fafafa';
          }
          break;
      }
    });
    
    handleContentChange();
  };

  // Apply table border color
  const applyTableBorderColor = (color) => {
    if (!selectedTable) return;
    
    const cells = selectedTable.querySelectorAll('td, th');
    cells.forEach(cell => {
      if (cell.style.border && cell.style.border !== 'none') {
        cell.style.borderColor = color;
      }
      if (cell.style.borderTop && cell.style.borderTop !== 'none') {
        cell.style.borderTopColor = color;
      }
      if (cell.style.borderBottom && cell.style.borderBottom !== 'none') {
        cell.style.borderBottomColor = color;
      }
      if (cell.style.borderLeft && cell.style.borderLeft !== 'none') {
        cell.style.borderLeftColor = color;
      }
      if (cell.style.borderRight && cell.style.borderRight !== 'none') {
        cell.style.borderRightColor = color;
      }
    });
    
    if (selectedTable.style.border) {
      selectedTable.style.borderColor = color;
    }
    
    handleContentChange();
  };

  // Apply table border width
  const applyTableBorderWidth = (width) => {
    if (!selectedTable) return;
    
    const cells = selectedTable.querySelectorAll('td, th');
    cells.forEach(cell => {
      if (cell.style.border && cell.style.border !== 'none') {
        const currentColor = cell.style.borderColor || '#d4d4d4';
        cell.style.border = `${width}px solid ${currentColor}`;
      }
    });
    
    if (selectedTable.style.border) {
      const currentColor = selectedTable.style.borderColor || '#d4d4d4';
      selectedTable.style.border = `${width}px solid ${currentColor}`;
    }
    
    handleContentChange();
  };

  // Apply cell background
  const applyTableCellBackground = (color) => {
    if (!selectedTable) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount) {
      let node = selection.getRangeAt(0).startContainer;
      while (node && node !== selectedTable) {
        if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'TD' || node.tagName === 'TH')) {
          node.style.backgroundColor = color;
          handleContentChange();
          return;
        }
        node = node.parentNode;
      }
    }
  };

  // Delete selected table
  const deleteSelectedTable = () => {
    if (selectedTable) {
      selectedTable.remove();
      setShowTableStyleModal(false);
      setSelectedTable(null);
      handleContentChange();
    }
  };

  // Export to PDF
  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;

    for (let i = 0; i < pages.length; i++) {
      // Create temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${pageWidth - 2 * margin}mm`;
      tempDiv.style.padding = `${margin}mm`;
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = fontFamily;
      tempDiv.style.fontSize = `${fontSize}px`;
      tempDiv.innerHTML = pages[i].content;
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Remove temp div
      document.body.removeChild(tempDiv);

      // Add to PDF
      if (i > 0) {
        pdf.addPage();
      }

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, Math.min(imgHeight, pageHeight - 2 * margin));
    }

    pdf.save(`${documentTitle}.pdf`);
  };

  // Update editor content when switching pages
  useEffect(() => {
    if (editorRef.current && currentPage) {
      editorRef.current.innerHTML = currentPage.content;
    }
  }, [currentPageIndex]);

  return (
    <div className="min-h-screen bg-neutral-50">
      
      {/* Toolbar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          
          {/* Document Title */}
          <div className="mb-3">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 px-0"
              placeholder="Document title"
            />
          </div>

          {/* Toolbar Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Font Family */}
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                execCommand('fontName', e.target.value);
              }}
              className="h-8 px-2 text-xs border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>

            {/* Font Size */}
            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                execCommand('fontSize', '7');
                // Apply custom size via style
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const span = document.createElement('span');
                  span.style.fontSize = `${e.target.value}px`;
                  range.surroundContents(span);
                }
              }}
              className="h-8 px-2 text-xs border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent w-16"
            >
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Text Format Buttons */}
            <button
              onClick={() => execCommand('bold')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Bold (Ctrl+B)"
            >
              <span className="font-bold text-sm">B</span>
            </button>

            <button
              onClick={() => execCommand('italic')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Italic (Ctrl+I)"
            >
              <span className="italic text-sm">I</span>
            </button>

            <button
              onClick={() => execCommand('underline')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Underline (Ctrl+U)"
            >
              <span className="underline text-sm">U</span>
            </button>

            <button
              onClick={() => execCommand('strikeThrough')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Strikethrough"
            >
              <span className="line-through text-sm">S</span>
            </button>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Alignment */}
            <button
              onClick={() => execCommand('justifyLeft')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            <button
              onClick={() => execCommand('justifyCenter')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Align Center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>

            <button
              onClick={() => execCommand('justifyRight')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>

            <button
              onClick={() => execCommand('justifyFull')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Justify"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Lists */}
            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="2" cy="6" r="1" fill="currentColor" />
                <circle cx="2" cy="12" r="1" fill="currentColor" />
                <circle cx="2" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>

            <button
              onClick={() => execCommand('insertOrderedList')}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <text x="0" y="8" fontSize="8">1.</text>
                <text x="0" y="14" fontSize="8">2.</text>
                <text x="0" y="20" fontSize="8">3.</text>
                <line x1="6" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="6" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
                <line x1="6" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Color */}
            <div className="flex items-center gap-1">
              <label className="h-8 px-2 flex items-center gap-1 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <input
                  type="color"
                  onChange={(e) => execCommand('foreColor', e.target.value)}
                  className="w-0 h-0 opacity-0"
                />
              </label>

              <label className="h-8 px-2 flex items-center gap-1 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
                <input
                  type="color"
                  onChange={(e) => execCommand('backColor', e.target.value)}
                  className="w-0 h-0 opacity-0"
                />
              </label>
            </div>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Link */}
            <button
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) execCommand('createLink', url);
              }}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            {/* Image */}
            <button
              onClick={() => {
                const url = prompt('Enter image URL:');
                if (url) execCommand('insertImage', url);
              }}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Insert Image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Table */}
            <button
              onClick={() => setShowTableModal(true)}
              className="h-8 w-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Insert Table"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Table Style */}
            <button
              onClick={openTableStyleModal}
              className="h-8 px-2 flex items-center gap-1 text-xs text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Table Style"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Style
            </button>

            <div className="w-px h-6 bg-neutral-200" />

            {/* Export to PDF */}
            <button
              onClick={exportToPDF}
              className="h-8 px-3 flex items-center gap-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto p-6">
        
        <div className="flex gap-6">
          
          {/* Page Navigation Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="sticky top-24 space-y-3">
              <div className="text-xs font-medium text-neutral-600 mb-2">Pages</div>
              
              <div className="space-y-1">
                {pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={`w-full h-9 px-3 text-left text-sm rounded-lg transition-colors ${
                      index === currentPageIndex
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Page {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={addNewPage}
                className="w-full h-9 px-3 text-sm text-neutral-600 border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                + New Page
              </button>

              {pages.length > 1 && (
                <button
                  onClick={deletePage}
                  className="w-full h-9 px-3 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Page
                </button>
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              {/* Page Header */}
              <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50">
                <div className="text-xs text-neutral-500">
                  Page {currentPageIndex + 1} of {pages.length}
                </div>
              </div>

              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                className="min-h-[800px] p-16 outline-none focus:outline-none"
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.6',
                }}
                suppressContentEditableWarning
              />
            </div>

            {/* Page Info */}
            <div className="mt-4 text-center text-xs text-neutral-500">
              Use the toolbar above to format your document
            </div>
          </div>

        </div>
      </div>

      {/* Insert Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Insert Table</h2>
              <button 
                onClick={() => setShowTableModal(false)} 
                className="h-8 w-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Rows
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Columns
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <button 
                onClick={() => setShowTableModal(false)} 
                className="h-9 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={insertTable}
                className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Insert Table
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Table Style Modal */}
      {showTableStyleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">Table Styling</h2>
              <button 
                onClick={() => {
                  setShowTableStyleModal(false);
                  setSelectedTable(null);
                }} 
                className="h-8 w-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              
              {/* Border Styles */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Border Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => applyTableBorderStyle('all')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 border-2 border-neutral-900 grid grid-cols-2 grid-rows-2">
                      <div className="border border-neutral-900"></div>
                      <div className="border border-neutral-900"></div>
                      <div className="border border-neutral-900"></div>
                      <div className="border border-neutral-900"></div>
                    </div>
                    <span className="text-xs text-neutral-600">All</span>
                  </button>

                  <button
                    onClick={() => applyTableBorderStyle('none')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 gap-0.5">
                      <div className="bg-neutral-200"></div>
                      <div className="bg-neutral-200"></div>
                      <div className="bg-neutral-200"></div>
                      <div className="bg-neutral-200"></div>
                    </div>
                    <span className="text-xs text-neutral-600">None</span>
                  </button>

                  <button
                    onClick={() => applyTableBorderStyle('outer')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 border-2 border-neutral-900 grid grid-cols-2 grid-rows-2">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span className="text-xs text-neutral-600">Outer</span>
                  </button>

                  <button
                    onClick={() => applyTableBorderStyle('horizontal')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 grid grid-cols-1 grid-rows-2 gap-0">
                      <div className="border-t-2 border-b border-neutral-900"></div>
                      <div className="border-t border-b-2 border-neutral-900"></div>
                    </div>
                    <span className="text-xs text-neutral-600">Horizontal</span>
                  </button>

                  <button
                    onClick={() => applyTableBorderStyle('vertical')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 grid grid-cols-2 grid-rows-1 gap-0">
                      <div className="border-l-2 border-r border-neutral-900"></div>
                      <div className="border-l border-r-2 border-neutral-900"></div>
                    </div>
                    <span className="text-xs text-neutral-600">Vertical</span>
                  </button>

                  <button
                    onClick={() => applyTableBorderStyle('header')}
                    className="h-16 border-2 border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="w-8 h-8 grid grid-rows-2">
                      <div className="bg-neutral-200 border-b-2 border-neutral-900"></div>
                      <div></div>
                    </div>
                    <span className="text-xs text-neutral-600">Header</span>
                  </button>
                </div>
              </div>

              {/* Border Width */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Border Width
                </label>
                <select
                  onChange={(e) => applyTableBorderWidth(e.target.value)}
                  className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  defaultValue="1"
                >
                  <option value="0.5">Thin (0.5px)</option>
                  <option value="1">Normal (1px)</option>
                  <option value="2">Medium (2px)</option>
                  <option value="3">Thick (3px)</option>
                  <option value="4">Extra Thick (4px)</option>
                </select>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    onChange={(e) => applyTableBorderColor(e.target.value)}
                    defaultValue="#d4d4d4"
                    className="h-9 w-20 rounded-lg border border-neutral-200 cursor-pointer"
                  />
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => applyTableBorderColor('#000000')}
                      className="h-9 w-9 rounded-lg bg-black border border-neutral-200 hover:scale-110 transition-transform"
                      title="Black"
                    />
                    <button
                      onClick={() => applyTableBorderColor('#d4d4d4')}
                      className="h-9 w-9 rounded-lg bg-neutral-300 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Gray"
                    />
                    <button
                      onClick={() => applyTableBorderColor('#3b82f6')}
                      className="h-9 w-9 rounded-lg bg-blue-500 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Blue"
                    />
                    <button
                      onClick={() => applyTableBorderColor('#ef4444')}
                      className="h-9 w-9 rounded-lg bg-red-500 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Red"
                    />
                  </div>
                </div>
              </div>

              {/* Cell Background */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cell Background (click in cell first)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    onChange={(e) => applyTableCellBackground(e.target.value)}
                    className="h-9 w-20 rounded-lg border border-neutral-200 cursor-pointer"
                  />
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => applyTableCellBackground('transparent')}
                      className="h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs hover:bg-neutral-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => applyTableCellBackground('#fafafa')}
                      className="h-9 w-9 rounded-lg bg-neutral-50 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Light Gray"
                    />
                    <button
                      onClick={() => applyTableCellBackground('#dbeafe')}
                      className="h-9 w-9 rounded-lg bg-blue-100 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Light Blue"
                    />
                    <button
                      onClick={() => applyTableCellBackground('#fef3c7')}
                      className="h-9 w-9 rounded-lg bg-yellow-100 border border-neutral-200 hover:scale-110 transition-transform"
                      title="Light Yellow"
                    />
                  </div>
                </div>
              </div>

              {/* Delete Table */}
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={deleteSelectedTable}
                  className="w-full h-9 px-4 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Table
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
              <button 
                onClick={() => {
                  setShowTableStyleModal(false);
                  setSelectedTable(null);
                }}
                className="h-9 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}