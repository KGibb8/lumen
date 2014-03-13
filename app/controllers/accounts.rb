Lumen::App.controllers do
    
  get '/accounts/results', :provides => [:json, :html] do
    sign_in_required!
    scope = params[:scope]
    scope_id = params[:scope_id]
    @o = (params[:o] ? params[:o] : 'date').to_sym
    @name = params[:name]
    @tag = params[:tag]
    @org = params[:org]
    @q = []
    @q << {:name => /#{@name}/i} if @name
    @q << {:id.in => AccountTagship.where(account_tag_id: AccountTag.find_by(name: @tag)).only(:account_id).map(&:account_id)} if @tag
    @q << {:id.in => Affiliation.where(organisation_id: Organisation.find_by(name: @org)).only(:account_id).map(&:account_id)} if @org
    @accounts = case scope
    when 'network'
      current_account.network
    when 'group'
      group = Group.find(scope_id)
      group.members
    when 'conversation'
      conversation = Conversation.find(scope_id)
      conversation.participants
    when 'organisation'
      organisation = Organisation.find(scope_id)
      organisation.members
    when 'sector'
      sector = Sector.find(scope_id)
      sector.members
    end 
    @accounts = @accounts.and(@q)
    @accounts = case @o
    when :name
      @accounts.order_by(:name.asc)
    when :date
      @accounts.order_by(:created_at.desc)
    when :updated
      @accounts.order_by([:has_picture.desc, :updated_at.desc])
    end
    case content_type
    when :json
      @accounts.map { |account|
      {
        :name => account.name,
        :organisations => Affiliation.where(:account_id => account.id).map { |affiliation| affiliation.organisation_fields['name'] },
        :account_tags => AccountTagship.where(:account_id => account.id).map { |account_tagship| account_tagship.account_tag_fields['name'] } 
      }
    }.to_json
    when :html
      @accounts = @accounts.per_page(10).page(params[:page])
      partial :'accounts/results'
    end
  end  
    
  get '/accounts/:id' do
    sign_in_required!
    @account = Account.find(params[:id])
    erb :'accounts/account'
  end    
              
end