export const documentationSections = {
  sections: [
    {
      id: 'howItWorks',
      title: 'How It Works',
      icon: 'book',
      type: 'detailed'
    },
    {
      id: 'keyPoints',
      title: 'Key Points',
      icon: 'check-circle',
      type: 'list'
    },
    {
      id: 'purpose',
      title: 'Purpose',
      icon: 'target',
      type: 'list',
      matcher: {
        pattern: /🎯 Purpose([\s\S]*?)(?=🔍|$)/,
        transform: (content) => content.split('-').filter(Boolean)
      }
    },
    {
      id: 'process',
      title: 'Process',
      icon: 'settings',
      type: 'numbered',
      matcher: {
        pattern: /🔍 How It Works([\s\S]*?)(?=💡|$)/,
        transform: (content) => content.split('\n').filter(line => line.match(/^\d/))
      }
    }
  ]
}; 