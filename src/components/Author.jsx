const Author = ({ author }) => {
  if (!author) {
    return null; // Or return a placeholder/fallback UI
  }

  const { name, bio, photo, url } = author;

  return (
    <div className="flex flex-col items-center md:flex-row gap-8 p-8 bg-n-7 rounded-2xl">
      {photo?.url && (
        <img 
          src={photo.url} 
          alt={name || 'Author'} 
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <div className="flex-1 text-center md:text-left">
        {name && <h3 className="h5 mb-2.5">{name}</h3>}
        {bio && <p className="body-2 text-n-3">{bio}</p>}
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block mt-4 text-color-1 hover:text-color-1/80 transition-colors"
          >
            View Profile
          </a>
        )}
      </div>
    </div>
  );
}; 