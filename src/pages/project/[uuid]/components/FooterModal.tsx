const FooterModal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-14 w-full">
      <div className="border-theme-neutral-300 absolute mx-[-13px] grid w-[calc(100%+26px)] grid-cols-2 gap-3 border-t px-[13px] pt-4 ">
        {children}
      </div>
    </div>
  );
};

export default FooterModal;
